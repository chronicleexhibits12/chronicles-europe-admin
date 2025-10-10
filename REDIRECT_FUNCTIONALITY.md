# Redirect Functionality Implementation

This document describes the implementation of the redirect functionality for blog posts and trade shows in the admin panel.

## Overview

The redirect functionality allows administrators to specify a URL that visitors will be redirected to when accessing a specific blog post or trade show page, instead of viewing the standard page.

## Database Changes

### New Column

A new column `redirect_url` has been added to both the `blog_posts` and `trade_shows` tables:

```sql
ALTER TABLE blog_posts ADD COLUMN redirect_url TEXT;
ALTER TABLE trade_shows ADD COLUMN redirect_url TEXT;
```

### Migration File

The changes are documented in the migration file:
`src/migrations/039_add_redirect_url_to_blog_posts.sql`

## Code Changes

### 1. Database Types

Updated `src/data/databaseTypes.ts` to include the `redirect_url` field in both `blog_posts` and `trade_shows` table definitions.

### 2. TypeScript Interfaces

Updated the TypeScript interfaces in:
- `src/data/blogTypes.ts`
- `src/data/tradeShowsTypes.ts`

### 3. Service Files

Updated the service files to handle the new `redirectUrl` field:
- `src/data/blogService.ts`
- `src/data/tradeShowsService.ts`

### 4. Admin Components

Updated the admin components to include the redirect URL field:
- `src/admin/blog/EditBlogPostAdmin.tsx`
- `src/admin/tradeShows/EditTradeShowAdmin.tsx`

### 5. Validation Utility

Created a validation utility file:
- `src/utils/redirectValidation.ts`

This file includes functions to:
- Validate URL format
- Check if a redirect URL exists in the appropriate table

## Usage

### Adding a Redirect URL

1. Navigate to the edit page for a blog post or trade show
2. Locate the "Redirect URL" field in the basic information section
3. Enter a full URL (e.g. https://example.com) or a relative path (e.g. /events)
4. Save the changes

### Validation

The system validates redirect URLs in the following ways:

1. **Format Validation**: Ensures the URL is either a valid full URL or a valid relative path
2. **Existence Validation**: For relative paths that point to internal content, the system checks if the content exists

## Implementation Details

### Frontend Validation

The admin components perform client-side validation before saving:
- Format validation using `validateRedirectUrlFormat`
- Existence validation using `validateRedirectUrlExists`

### Backend Implementation

The service files have been updated to:
- Include the `redirectUrl` field when creating/updating records
- Return the `redirectUrl` field when fetching records

## Future Considerations

1. **Enhanced Validation**: Implement more sophisticated validation for internal URLs
2. **Redirect Tracking**: Add analytics to track redirect usage
3. **Bulk Operations**: Add support for setting redirects in bulk operations