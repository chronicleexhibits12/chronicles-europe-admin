-- Create global_locations table to store global cities and countries as arrays
CREATE TABLE IF NOT EXISTS global_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  cities TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  countries TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL
);

-- Insert a default row if none exists
INSERT INTO global_locations (id)
SELECT '00000000-0000-0000-0000-000000000000'
WHERE NOT EXISTS (
  SELECT 1 FROM global_locations
);

-- Enable RLS (Row Level Security)
ALTER TABLE global_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for global_locations
CREATE POLICY "Enable read access for all users" ON global_locations
FOR SELECT USING (true);

CREATE POLICY "Enable update access for authenticated users" ON global_locations
FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_global_locations_updated_at
BEFORE UPDATE ON global_locations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();