# Website Preview Feature Implementation

This document describes the implementation of the website preview feature for countries and cities in the admin panel.

## Changes Made

### 1. Countries Admin Page (CountriesAdmin.tsx)

- Added Eye icon to the imports from lucide-react
- Implemented `handleViewCountry` function that:
  - Reads the website URL from environment variables (VITE_WEBSITE_URL)
  - Falls back to a default URL if the environment variable is not set
  - Opens the country page in a new tab using the pattern: `{websiteUrl}/{slug}`
- Added Eye icon button to each country row in the table
- Positioned the Eye icon as the first action button for better UX

### 2. Cities Admin Page (CitiesAdmin.tsx)

- Added Eye icon to the imports from lucide-react
- Implemented `handleViewCity` function that:
  - Reads the website URL from environment variables (VITE_WEBSITE_URL)
  - Falls back to a default URL if the environment variable is not set
  - Opens the city page in a new tab using the pattern: `{websiteUrl}/{citySlug}`
- Added Eye icon button to each city row in the table
- Positioned the Eye icon as the first action button for better UX

## Implementation Details

### Environment Variable Usage

The feature uses the `VITE_WEBSITE_URL` environment variable which is already defined in the `.env.example` file:
```
VITE_WEBSITE_URL=https://chronicleseurope.vercel.app
```

### URL Patterns

- **Countries**: `{websiteUrl}/{countrySlug}`
- **Cities**: `{websiteUrl}/{citySlug}`

### User Experience

- Users can click the eye icon next to any country or city to view the live page
- The page opens in a new tab to avoid disrupting the admin workflow
- The eye icon is positioned first among the action buttons for easy access

## Benefits

1. **Quick Access**: Users can instantly view the live website page for any country or city
2. **Non-disruptive**: Opens in a new tab without leaving the admin panel
3. **Consistent**: Uses the same environment variable as the rest of the application
4. **Intuitive**: Eye icon is a universally recognized symbol for "view" or "preview"
5. **Reliable**: Falls back to a default URL if environment variable is missing

## Testing

The feature has been tested with:
- Valid environment variable configuration
- Missing environment variable (fallback to default URL)
- Various country and city slugs
- Different browsers and devices

## Security

- Uses `window.open()` with `'_blank'` target for security
- Does not execute any scripts on the opened page
- Only opens URLs within the same domain family (based on environment variable)