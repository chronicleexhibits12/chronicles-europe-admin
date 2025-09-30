-- Migration to add alt text support for exhibition stand type images in main_countries_page table

-- Since the exhibition_stand_types column is JSONB, we need to update the existing data structure
-- to include alt text arrays for each exhibition stand type's images

-- First, let's create a function to add alt text arrays to existing exhibition stand types
CREATE OR REPLACE FUNCTION add_alt_text_to_exhibition_stand_types()
RETURNS void AS $$
DECLARE
    main_country_row RECORD;
    updated_stand_types JSONB;
    stand_type JSONB;
    updated_stand_type JSONB;
    i INT;
BEGIN
    -- Loop through all rows in main_countries_page
    FOR main_country_row IN 
        SELECT id, exhibition_stand_types 
        FROM main_countries_page 
        WHERE exhibition_stand_types IS NOT NULL
    LOOP
        -- Initialize updated_stand_types as an empty array
        updated_stand_types := '[]'::JSONB;
        
        -- Loop through each exhibition stand type
        FOR i IN 0..(jsonb_array_length(main_country_row.exhibition_stand_types) - 1)
        LOOP
            stand_type := main_country_row.exhibition_stand_types->i;
            
            -- Add empty imagesAlt array if images array exists
            IF stand_type ? 'images' THEN
                updated_stand_type := stand_type || jsonb_build_object('imagesAlt', '[]'::JSONB);
            ELSE
                updated_stand_type := stand_type;
            END IF;
            
            -- Add updated stand type to the array
            updated_stand_types := updated_stand_types || jsonb_build_array(updated_stand_type);
        END LOOP;
        
        -- Update the row with the new exhibition_stand_types structure
        UPDATE main_countries_page 
        SET exhibition_stand_types = updated_stand_types
        WHERE id = main_country_row.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update existing data
SELECT add_alt_text_to_exhibition_stand_types();

-- Drop the function as it's no longer needed
DROP FUNCTION add_alt_text_to_exhibition_stand_types();