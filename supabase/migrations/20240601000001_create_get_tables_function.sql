-- Create a function to list tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (table_name text, table_schema text) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text, t.table_schema::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  ORDER BY t.table_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_tables() TO anon;
