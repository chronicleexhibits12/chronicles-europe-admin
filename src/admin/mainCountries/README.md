# Main Countries Page Admin

This admin module allows you to manage the content for the main countries page of the website.

## Features

- SEO metadata management (title, description, keywords)
- Hero section with background image and alt text
- Exhibition stand types with images and CTAs
- Portfolio showcase section
- Build section with title, highlight, and description
- Image upload functionality for all image fields
- Alt text support for accessibility

## Structure

The main countries page is structured into the following sections:

1. **SEO Metadata** - Title, description, and keywords for search engine optimization
2. **Hero Section** - Main banner with title, subtitle, description, and background image
3. **Exhibition Stand Types** - Configurable list of stand types with images and CTAs
4. **Portfolio Showcase** - Portfolio section with title, description, and CTA
5. **Build Section** - Build information with title, highlight, and description

## Usage

1. Navigate to the admin panel
2. Go to Pages > Main Countries Page
3. Edit the content in each section as needed
4. Upload images using the "Upload Image" buttons
5. Add alt text for all images for accessibility
6. Click "Save Changes" to publish your updates

## Technical Details

- All data is stored in the `main_countries_page` table in the database
- Images are uploaded to the `main-countries-images` storage bucket
- The page is accessible at `/major-countries` on the website
- Changes are automatically revalidated for immediate updates