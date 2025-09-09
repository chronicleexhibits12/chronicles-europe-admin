import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Upload, Trash2, Edit3 } from 'lucide-react'
import { PortfolioService } from '@/data/portfolioService'
import type { PortfolioPage, PortfolioItem } from '@/data/portfolioTypes'
import { TagInput } from '@/components/ui/tag-input'

export function PortfolioAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [portfolio, setPortfolio] = useState<PortfolioPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form fields
  const [heroTitle, setHeroTitle] = useState('')
  const [portfolioTitle, setPortfolioTitle] = useState('')
  const [portfolioSubtitle, setPortfolioSubtitle] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [seoKeywordsArray, setSeoKeywordsArray] = useState<string[]>([])
  
  // New item form
  const [newItemImage, setNewItemImage] = useState('')
  const [newItemFeatured, setNewItemFeatured] = useState(false)
  
  // Edit item form
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const [editingItemImage, setEditingItemImage] = useState('')
  const [editingItemFeatured, setEditingItemFeatured] = useState(false)

  // Load portfolio data
  useEffect(() => {
    loadPortfolioData()
  }, [])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      const { data, error } = await PortfolioService.getPortfolioPage()
      
      if (error) {
        setError(error)
        return
      }
      
      if (data) {
        setPortfolio(data)
        setHeroTitle(data.hero.title)
        setPortfolioTitle(data.portfolio.title)
        setPortfolioSubtitle(data.portfolio.subtitle)
        setSeoTitle(data.seo.title)
        setSeoDescription(data.seo.description)
        setSeoKeywordsArray(data.seo.keywords ? data.seo.keywords.split(',').map(k => k.trim()).filter(k => k) : [])
      }
    } catch (err) {
      setError('Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!portfolio) return
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const updatedData = {
        hero: {
          title: heroTitle,
          backgroundImage: portfolio.hero.backgroundImage // Keep existing background image
        },
        portfolio: {
          title: portfolioTitle,
          subtitle: portfolioSubtitle
        },
        seo: {
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywordsArray.join(', ')
        }
      }
      
      const { error } = await PortfolioService.updatePortfolioPage(updatedData)
      
      if (error) {
        setError(error)
      } else {
        setSuccess('Portfolio updated successfully')
        loadPortfolioData() // Reload to get updated data
      }
    } catch (err) {
      setError('Failed to update portfolio')
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItemImage) {
      setError('Please provide an image')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const newItem: PortfolioItem = {
        image: newItemImage,
        featured: newItemFeatured
      }
      
      const { error } = await PortfolioService.addPortfolioItem(newItem)
      
      if (error) {
        setError(error)
      } else {
        setSuccess('Portfolio item added successfully')
        setNewItemImage('')
        setNewItemFeatured(false)
        loadPortfolioData() // Reload to get updated data
      }
    } catch (err) {
      setError('Failed to add portfolio item')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async (index: number) => {
    if (!editingItemImage) {
      setError('Please provide an image')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const updatedItem: PortfolioItem = {
        image: editingItemImage,
        featured: editingItemFeatured
      }
      
      const { error } = await PortfolioService.updatePortfolioItem(index, updatedItem)
      
      if (error) {
        setError(error)
      } else {
        setSuccess('Portfolio item updated successfully')
        setEditingItemIndex(null)
        loadPortfolioData() // Reload to get updated data
      }
    } catch (err) {
      setError('Failed to update portfolio item')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (index: number) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Get the image URL to delete from storage
      if (portfolio?.items[index]) {
        const imageUrl = portfolio.items[index].image
        // Delete the image from storage
        await PortfolioService.deleteImage(imageUrl)
      }
      
      const { error } = await PortfolioService.deletePortfolioItem(index)
      
      if (error) {
        setError(error)
      } else {
        setSuccess('Portfolio item deleted successfully')
        loadPortfolioData() // Reload to get updated data
      }
    } catch (err) {
      setError('Failed to delete portfolio item')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      setSaving(true)
      setError(null)
      
      const { data, error } = await PortfolioService.uploadImage(file)
      
      if (error) {
        setError(error)
      } else if (data) {
        setNewItemImage(data)
        setSuccess('Image uploaded successfully')
      }
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setSaving(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleEditItemClick = (index: number) => {
    if (!portfolio) return
    
    setEditingItemIndex(index)
    setEditingItemImage(portfolio.items[index].image)
    setEditingItemFeatured(portfolio.items[index].featured)
  }

  const handleKeywordsChange = (keywords: string[]) => {
    setSeoKeywordsArray(keywords)
  }

  // Count featured items
  const featuredItemCount = portfolio?.items.filter(item => item.featured).length || 0
  const canFeatureMore = featuredItemCount < 6

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!portfolio) {
    return (
      <Alert>
        <AlertDescription>No portfolio data found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio page content and images
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input
              id="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Portfolio"
            />
          </div>
        </CardContent>
      </Card>

      {/* Home Portfolio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Home Portfolio Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolioTitle">Title</Label>
            <Input
              id="portfolioTitle"
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              placeholder="Our Portfolio"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolioSubtitle">Subtitle</Label>
            <Textarea
              id="portfolioSubtitle"
              value={portfolioSubtitle}
              onChange={(e) => setPortfolioSubtitle(e.target.value)}
              placeholder="Explore our extensive portfolio of exhibition stands..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items Section */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Items</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Item Form */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Add New Portfolio Item</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button variant="outline" className="h-10 px-3" onClick={triggerFileInput}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Image Preview */}
              {newItemImage && (
                <div className="mt-2">
                  <Label>Preview</Label>
                  <div className="mt-1 border rounded-md overflow-hidden">
                    <img 
                      src={newItemImage} 
                      alt="New portfolio item preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  id="newItemFeatured"
                  type="checkbox"
                  checked={newItemFeatured}
                  onChange={(e) => {
                    if (!canFeatureMore && e.target.checked) {
                      setError('You can only make 6 images as featured. Remove featured status from existing items first.')
                      return
                    }
                    setNewItemFeatured(e.target.checked)
                  }}
                  disabled={!canFeatureMore && !newItemFeatured}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="newItemFeatured">Featured Item</Label>
                {!canFeatureMore && !newItemFeatured && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (You can only make 6 images as featured)
                  </span>
                )}
              </div>
              
              <Button onClick={handleAddItem} disabled={saving}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Portfolio Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.items.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {editingItemIndex === index ? (
                  // Edit Mode
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <Input
                        value={editingItemImage}
                        onChange={(e) => setEditingItemImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    {/* Image Preview */}
                    {editingItemImage && (
                      <div className="mt-2">
                        <Label>Preview</Label>
                        <div className="mt-1 border rounded-md overflow-hidden">
                          <img 
                            src={editingItemImage} 
                            alt="Editing portfolio item preview" 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingItemFeatured}
                        onChange={(e) => {
                          if (!canFeatureMore && e.target.checked && !editingItemFeatured) {
                            setError('You can only make 6 images as featured. Remove featured status from existing items first.')
                            return
                          }
                          setEditingItemFeatured(e.target.checked)
                        }}
                        disabled={!canFeatureMore && !editingItemFeatured}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label>Featured</Label>
                      {!canFeatureMore && !editingItemFeatured && (
                        <span className="text-sm text-muted-foreground ml-2">
                          (You can only make 6 images as featured)
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateItem(index)}
                        disabled={saving}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItemIndex(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={`Portfolio item ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      {item.featured && (
                        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditItemClick(index)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteItem(index)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Our Portfolio - Company Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Explore our portfolio of work..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seoKeywords">SEO Keywords</Label>
            <TagInput
              tags={seoKeywordsArray}
              onChange={handleKeywordsChange}
              placeholder="Type keywords and press Enter"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Press Enter, comma, or semicolon after typing each keyword to add it
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}