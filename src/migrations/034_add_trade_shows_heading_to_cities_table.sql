-- Add trade shows heading field to cities table

ALTER TABLE cities 
ADD COLUMN trade_shows_heading TEXT;

-- Update existing city records with default trade shows heading values
UPDATE cities 
SET trade_shows_heading = 'Popular Trade Shows in ' || name
WHERE trade_shows_heading IS NULL;

-- Update the get_city_by_country_and_slug function to include the new trade shows heading field
CREATE OR REPLACE FUNCTION get_city_by_country_and_slug(
    country_slug_param TEXT,
    city_slug_param TEXT
)
RETURNS SETOF cities
LANGUAGE sql
STABLE
AS $$
    SELECT * FROM cities
    WHERE country_slug = country_slug_param
    AND city_slug = city_slug_param
    LIMIT 1;
$$;

-- Update the get_available_cities function to maintain consistency
CREATE OR REPLACE FUNCTION get_available_cities()
RETURNS TABLE(country_slug TEXT, city_slug TEXT)
LANGUAGE sql
STABLE
AS $$
    SELECT country_slug, city_slug FROM cities;
$$;

-- Example of how to update an existing city with custom trade shows heading
/*
UPDATE cities 
SET trade_shows_heading = 'Popular Trade Shows in Paris'
WHERE city_slug = 'paris';
*/

-- Example of how to update another city with custom trade shows heading
/*
UPDATE cities 
SET trade_shows_heading = 'Popular Trade Shows in Reims'
WHERE city_slug = 'reims';
*/