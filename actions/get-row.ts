import { createClient } from "@/utils/supabase/server";

type QueryConfig = {
  table: string;
  column: string;
  value: string | number;
  withFile?: boolean;
  storageBucket?: string;
};

async function getRow<T = any>({
  table,
  column,
  value,
  withFile = false,
  storageBucket = ''
}: QueryConfig) {
  try {
    const supabase = await createClient();

    // Get row data
    const { data: rowData, error } = await supabase
      .from(table)
      .select('*')
      .eq(column, value)
      .single();

    if (error) throw error;

    let file = null;
    if (withFile && rowData?.file_path) {
      const { data: fileData } = supabase
        .storage
        .from(storageBucket) 
        .getPublicUrl(rowData.file_path);
      
      file = fileData.publicUrl;
    }

    return { 
      data: rowData as T, 
      file,
      error: null 
    };

  } catch (error) {
    return {
      data: null,
      file: null,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

export default getRow;