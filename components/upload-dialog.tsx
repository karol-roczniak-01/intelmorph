import useUploadDialog from "@/hooks/use-upload-dialog";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState, useCallback, useRef } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import * as tus from "tus-js-client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MultiSelect } from "./ui/multi-select";
import { categoriesAndTags } from "@/data/categories-and-tags";
import { languages } from "@/data/languages";
import { CategoryConfig } from "@/types";

const categoryConfigs: Record<string, CategoryConfig> = {
  podcast: {
    inputs: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'e.g. Quantum Computing Chronicles',
        validation: { required: 'Title is required.' }
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'e.g. This series highlights our groundbreaking work in developing quantum algorithms, overcoming hardware challenges, and advancing error correction techniques. We’ll discuss how these innovations are poised to transform industries like cryptography, materials science, and AI, paving the way for the supercomputers of tomorrow.',
        validation: { required: 'Description is required.' }
      },
      {
        id: 'language',
        type: 'select',
        label: 'Language',
        options: languages,
        validation: { required: 'Language is required.' }
      },
      {
        id: 'category',
        type: 'categorySelect',
        label: 'Category',
        validation: { required: 'Category is required.' }
      },
      {
        id: 'tags',
        type: 'tagsSelect',
        label: 'Tags',
        maxCount: 3,
        dependent: {
          field: 'category',
          value: ''
        },
        validation: { required: 'Tags are required.' },
      },
      {
        id: 'file',
        type: 'file',
        label: 'Image',
        validation: { required: 'Image is required.' }
      }
    ],
    defaultValues: {
      title: '',
      description: '',
      language: '',
      category: '',
      tags: [],
      file: null
    },
    insertOptions: {
      tableName: 'podcasts',
      bucketName: 'podcast_covers',
      contentType: 'image/jpeg',
      requiredFields: ['user_id', 'title', 'description', 'language', 'category', 'tags', 'file_path', 'file_size'],
      transformData: (values) => ({
        ...values,
        tags: values.tags.join(',')
      })
    }
  },
  paper: {
    inputs: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        validation: { required: 'Title is required.' }
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        validation: { required: 'Description is required.' }
      }
    ],
    defaultValues: {
      title: '',
      description: '',
      file: null
    },
    insertOptions: {
      tableName: 'papers',
      requiredFields: ['user_id', 'title', 'description', 'file_path'],
      transformData: (values) => ({
        ...values,
        file_path: values.file_path
      })
    }
  }
};

const InputField = ({ 
  config, 
  register, 
  setValue, 
  trigger, 
  watch, 
  errors,
  fileName,
  onFileChange ,
  disabled
}: any) => {
  switch (config.type) {
    case 'text':
      return (
        <Input
          id={config.id}
          label={config.label}
          error={errors[config.id]}
          placeholder={config.placeholder || ''}
          helperText={config.helperText}
          {...register(config.id, config.validation)}
          disabled={disabled}
        />
      );
    
    case 'textarea':
      return (
        <Textarea
          id={config.id}
          label={config.label}
          error={errors[config.id]}
          placeholder={config.placeholder || ''}
          helperText={config.helperText}
          {...register(config.id, config.validation)}
          disabled={disabled}
        />
      );
    
    case 'select':
      return (
        <Select
          {...register(config.id, config.validation)}
          onValueChange={(value) => {
            setValue(config.id, value);
            trigger(config.id);
          }}
          disabled={disabled}
        >
          <SelectTrigger
            label={config.label}
            className="w-full"
            error={errors[config.id]}
            helperText={config.helperText}
          >
            <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {config.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );

    case 'categorySelect':
      return (
        <Select 
          {...register(config.id, config.validation)}
          onValueChange={(value) => { 
            setValue(config.id, value);
            setValue('tags', []);
            trigger(config.id);
          }}
          disabled={disabled}
        >
          <SelectTrigger 
            label={config.label}
            className="w-full"
            error={errors[config.id]}
            helperText={config.helperText}
          >
            <SelectValue placeholder={`Select ${config.label.toLowerCase()}`}/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoriesAndTags.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );

    case 'tagsSelect':
      if (!watch('category')) return null;
      return (
        <MultiSelect
          key={watch('category')}
          {...register(config.id, config.validation)}
          id={config.id}
          label={config.label}
          options={categoriesAndTags
            .find(lang => lang.value === watch('category'))
            ?.variants.map(variant => ({
              label: variant.label,
              value: variant.value
            })) || []
          }
          error={errors[config.id]}
          onValueChange={(value) => {
            setValue(config.id, value);
          }}
          disabled={disabled}
          placeholder={`Select ${config.label.toLowerCase()}`}   
          variant="inverted"
          maxCount={config.maxCount}
          helperText={config.helperText}
        />
      );
    
    case 'file':
      return (
        <Input
          type="file"
          id={config.id}
          label={config.label}
          error={errors[config.id]}
          placeholder={config.placeholder || ''}
          helperText={config.helperText}
          {...register(config.id, config.validation)}
          onChange={onFileChange}
          fileName={fileName}
          disabled={disabled}
        />
      );

    default:
      return null;
  }
};

const UploadDialog = () => {
  const router = useRouter();
  const supabase = createClient();
  const uploadDialog = useUploadDialog();

  const { userId, category } = uploadDialog;
  const categoryConfig = categoryConfigs[category || 'default'];
  const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Item";

  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const uploadRef = useRef<tus.Upload | null>(null);

  const startUpload = useCallback(async (file: File): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession()

    return new Promise((resolve, reject) => {
      const uniqueID = uniqid();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${category}-${uniqueID}.${fileExtension}`;

      const upload = new tus.Upload(file, {
        endpoint: `https://${process.env.NEXT_PUBLIC_PROJECT_ID}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session?.access_token}`,
          'x-upsert': 'true',
        },
        metadata: {
          bucketName: categoryConfig.insertOptions.bucketName || '',
          objectName: fileName,
          contentType: categoryConfig.insertOptions.contentType || '',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024,
        onError: (error) => {
          console.error('Failed because: ' + error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setUploadProgress(Number(percentage));
        },
        onSuccess: () => {
          if (upload.url) {
            setUploadUrl(upload.url);
            resolve(fileName);
          } else {
            reject(new Error('Upload URL not available'));
          }
        }
      });

      uploadRef.current = upload;

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
  }, [category, userId]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadDialog.onClose();
      setFileName('');
      setUploadProgress(0);
      setUploadUrl(null);
      // Abort ongoing upload if exists
      if (uploadRef.current) {
        uploadRef.current.abort();
        uploadRef.current = null;
      }
    }
  };

  const {
    setValue,
    register,
    trigger,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: categoryConfig?.defaultValues
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setUploadProgress(0);
      setUploadUrl(null);
    } else {
      setFileName('');
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!values.file || !values.file[0]) {
        throw new Error('No file selected');
      }

      if (!userId || !categoryConfig) {
        throw new Error('Missing required configuration');
      }

      const fileSizeMB = Number((values.file[0].size / (1024 * 1024)).toFixed(1));
      const uploadedFileName = await startUpload(values.file[0]);

      // Transform data based on category configuration
      let insertData = {
        ...values,
        user_id: userId,
        file_path: uploadedFileName,
        file_size: fileSizeMB,
      };

      if (categoryConfig.insertOptions.transformData) {
        insertData = categoryConfig.insertOptions.transformData(insertData);
      }

      // Filter out any fields not specified in requiredFields or optionalFields
      const allowedFields = [
        ...categoryConfig.insertOptions.requiredFields,
        ...(categoryConfig.insertOptions.optionalFields || [])
      ];
      
      const filteredData = Object.fromEntries(
        Object.entries(insertData).filter(([key]) => allowedFields.includes(key))
      );

      const { error: dbError } = await supabase
        .from(categoryConfig.insertOptions.tableName)
        .insert(filteredData);

      if (dbError) {
        throw dbError;
      }

      router.refresh();
      toast({ 
        title: `${formattedCategory} Created!`, 
        description: `Your ${category} has been created successfully.` 
      });
      reset();
      uploadDialog.onClose();
      setFileName('');
      setUploadProgress(0);
      setUploadUrl(null);
    } catch (error) {
      toast({ 
        title: 'Oops!', 
        variant: "destructive", 
        description: error instanceof Error ? error.message : "Something went wrong." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = () => {
    if (!categoryConfig) return null;
    
    return (
      <>
        {categoryConfig.inputs.map((config) => (
          <InputField
            key={config.id}
            config={config}
            register={register}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
            errors={errors}
            fileName={fileName}
            onFileChange={handleFileChange}
            disabled={isLoading}
          />
        ))}
      </>
    );
  };

  return (
    <Dialog 
      open={uploadDialog.isOpen} 
      onOpenChange={onChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {formattedCategory}</DialogTitle>
          <DialogDescription>
            Fill out the details below and click 'Create'.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 h-full justify-between">
          <div className="flex flex-col gap-4">
            {renderInputs()}
          </div>
          <DialogFooter className="flex justify-between w-full">
            <Button 
              type="submit"
              disabled={isLoading}
              className="text-right w-full sm:w-fit"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  Creating...
                  <span className="ml-2">{uploadProgress.toFixed(1)}%</span>
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;