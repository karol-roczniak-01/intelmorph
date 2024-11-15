import { createClient } from "@/utils/supabase/server";

type QueryConfig = {
  table: string;
  column?: string;
  value?: any;
  withFile?: boolean;
  storageBucket?: string;
  joinConfig?: {
    table: string;
    column: string;
    foreignKey: string;
    fields: string[];
  };
};

async function getRows<T = any>({
  table,
  column,
  value,
  withFile = false,
  storageBucket = '',
  joinConfig,
}: QueryConfig) {
  try {
    const supabase = await createClient();

    let selectQuery = '*';

    if (joinConfig) {
      const { table: joinTable, fields } = joinConfig;
      const joinFields = fields.join(', ');
      selectQuery = `*, ${joinTable} (${joinFields})`;
      console.log('Join configuration:', joinConfig);
    }

    let query = supabase.from(table).select(selectQuery);

    if (column && value) {
      query = query.eq(column, value);
    }

    const { data: rowsData, error } = await query;

    if (error) {
      console.error('Error executing query:', error);
      throw error;
    }

    let file = null;
    if (withFile && rowsData?.length > 0 && 'file_path' in rowsData[0]) {
      const { data: fileData } = supabase
        .storage
        .from(storageBucket)
        .getPublicUrl((rowsData[0] as { file_path: string }).file_path);

      file = fileData.publicUrl;
    }

    return {
      data: rowsData as T[],
      file,
      error: null,
    };
  } catch (error) {
    console.error('Error in getRows:', error);
    return {
      data: [],
      file: null,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export default getRows;