# Portfolio Image and Alt Text Linking Implementation

This document describes the implementation of a strict one-to-one relationship between portfolio images and their alt texts.

## Implementation Details

### 1. One-to-One Relationship

Each portfolio image is strictly linked to a specific alt text:
- When a new image is added, its alt text is added at the same index position
- When an image is deleted, its corresponding alt text is also deleted at the same index position
- The arrays for images and alt texts are always kept in sync

### 2. Service Layer Implementation

In the `portfolioService.ts` file:

1. **Add Portfolio Item**: 
   - The `addPortfolioItem` method adds a new image to the beginning of the images array
   - The alt text is added to the beginning of the alt texts array in a separate update call
   - Both operations maintain the same order to preserve the one-to-one relationship

2. **Delete Portfolio Item**:
   - The `deletePortfolioItem` method removes both the image and its corresponding alt text at the same index
   - This ensures no orphaned alt texts remain when an image is deleted

### 3. Admin UI Implementation

In the `PortfolioAdmin.tsx` file:

1. **Add New Item**:
   - Users provide both an image and its alt text when adding a new portfolio item
   - The image is added first, then the alt text is added to maintain synchronization

2. **Delete Item**:
   - When deleting an item, both the image and its alt text are removed together
   - The delete operation maintains the synchronization between the two arrays

3. **Edit Alt Text**:
   - Users can edit existing alt texts through the edit dialog
   - The edit operation updates the alt text at the specific index without affecting the image

### 4. Data Structure

The portfolio data maintains two parallel arrays:
- `items`: Array of portfolio item objects containing image URLs
- `itemsAlt`: Array of strings containing alt texts for each image

The index position in both arrays represents the same portfolio item, ensuring a strict one-to-one relationship.

## Benefits

1. **Data Integrity**: Images and alt texts are always kept in sync
2. **Accessibility**: Each image has a corresponding alt text for screen readers
3. **SEO**: Search engines can better understand the content of images
4. **User Experience**: Clear association between images and their descriptions

## Validation

The implementation has been validated to ensure:
- Adding new items maintains the one-to-one relationship
- Deleting items removes both image and alt text
- Editing alt texts updates the correct item
- No orphaned data is left in the database