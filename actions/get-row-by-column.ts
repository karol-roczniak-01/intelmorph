import { createClient } from "@/utils/supabase/server";

type QueryConfig = {
  table: string;
  column: string;
  value: string | number;
  withImage?: boolean;
  storageBucket?: string;
};

async function getRowByColumn<T = any>({
  table,
  column,
  value,
  withImage = false,
  storageBucket = 'avatars'
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

    let imageUrl = null;
    if (withImage && rowData?.image_path) {
      const { data: imageData } = supabase
        .storage
        .from(storageBucket) 
        .getPublicUrl(rowData.image_path);
      
      imageUrl = imageData.publicUrl;
    }

    return { 
      data: rowData as T, 
      imageUrl,
      error: null 
    };

  } catch (error) {
    return {
      data: null,
      imageUrl: null,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

export default getRowByColumn;