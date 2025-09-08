# Services Admin Guide

This guide explains how to use the Services Admin page in the admin panel.

## Overview

The Services Admin page allows you to manage the content of the Services page on your website. It includes:

1. Hero section with title, subtitle, and background image
2. Intro section with title and description
3. Individual service items that can be added, edited, or removed

## Accessing the Services Admin

1. Navigate to the admin panel
2. Go to the "Pages" section
3. Find "Services Page" in the list of pages
4. Click the "Edit" button to access the Services Admin

## Managing Content

### Hero Section

- **Hero Title**: The main title displayed in the hero section
- **Hero Subtitle**: A subtitle that appears below the main title
- **Background Image**: The background image for the hero section
  - You can enter a URL directly or upload an image using the upload button
  - Alt text should be provided for accessibility

### Intro Section

- **Intro Title**: The title for the introduction section
- **Intro Description**: The main content of the introduction section
  - This supports rich text formatting

### Service Items

Service items can be added, edited, and removed:

1. Click "Add Service" to create a new service item
2. Fill in the service title and description
3. Click "Save Service Item" to save the service
4. To edit a service, modify the fields and click "Save Service Item"
5. To remove a service, click the trash can icon

## Image Management

All images are stored in the Supabase storage bucket `services-images`. When you upload an image:

1. The image is automatically uploaded to the storage bucket
2. A public URL is generated and inserted into the appropriate field
3. The website is automatically revalidated to show the new image

## SEO Metadata

- **SEO Title**: The title tag for the services page
- **SEO Description**: The meta description for the services page
- **SEO Keywords**: Keywords for the services page (comma separated)

## Saving Changes

After making any changes, click the "Save Changes" button at the bottom of the page. This will:

1. Save all your changes to the database
2. Trigger revalidation of the services page on the website
3. Show a success message when complete

## Troubleshooting

If you encounter any issues:

1. Check that all required fields are filled in
2. Ensure image URLs are valid
3. Verify that you have proper permissions to edit content
4. Check the browser console for any error messages

## Technical Details

The Services Admin uses the following components:

- `ServicesPageService`: Handles all API calls to Supabase
- `useServicesPage`: Custom hook for managing services page state
- `ServicesAdmin`: The main React component for the admin interface

The data is stored in the `services` table in Supabase, with a single row for page content (where `is_service = false`) and multiple rows for individual services (where `is_service = true`).