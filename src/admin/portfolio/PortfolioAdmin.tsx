import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Upload, Trash2, Image, Edit, Check, X } from 'lucide-react'
import { PortfolioService } from '@/data/portfolioService'
import type { PortfolioPage, PortfolioItem } from '@/data/portfolioTypes'
import { TagInput } from '@/components/ui/tag-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function PortfolioAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [portfolio, setPortfolio] = useState<PortfolioPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form fields
  const [heroTitle, setHeroTitle] = useState('')
  const [heroBackgroundImageAlt, setHeroBackgroundImageAlt] = useState('')
  const [portfolioTitle, setPortfolioTitle] = useState('')
  const [portfolioSubtitle, setPortfolioSubtitle] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [seoKeywordsArray, setSeoKeywordsArray] = useState<string[]>([])
  
  // New item form
  const [newItemImage, setNewItemImage] = useState('')
  const [newItemAlt, setNewItemAlt] = useState('')
  
  // Edit item dialog
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const [editingItemAlt, setEditingItemAlt] = useState('')

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
        setHeroBackgroundImageAlt(data.hero.backgroundImageAlt || '')
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
          backgroundImage: portfolio.hero.backgroundImage, // Keep existing background image
          backgroundImageAlt: heroBackgroundImageAlt
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
      
      // Always set featured to false since we're removing this functionality
      const newItem: PortfolioItem = {
        image: newItemImage,
        featured: false
      }
      
      const { error: addItemError } = await PortfolioService.addPortfolioItem(newItem)
      
      if (addItemError) {
        setError(addItemError)
        setSaving(false)
        return
      }
      
      // Update alt texts to include the new alt text
      const { data: updatedPortfolio } = await PortfolioService.getPortfolioPage()
      if (updatedPortfolio) {
        const currentItemsAlt = updatedPortfolio.itemsAlt || []
        const updatedItemsAlt = [newItemAlt, ...currentItemsAlt]
        
        const { error: updateAltError } = await PortfolioService.updatePortfolioPage({
          itemsAlt: updatedItemsAlt
        })
        
        if (updateAltError) {
          setError(updateAltError)
        } else {
          setSuccess('Portfolio item added successfully')
          setNewItemImage('')
          setNewItemAlt('')
          loadPortfolioData() // Reload to get updated data
        }
      }
    } catch (err) {
      setError('Failed to add portfolio item')
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

  const handleKeywordsChange = (keywords: string[]) => {
    setSeoKeywordsArray(keywords)
  }
  
  // Handle edit item alt text
  const handleEditItemAlt = async (index: number, newAltText: string) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Update the alt text for the specific item
      const updatedItemsAlt = [...(portfolio?.itemsAlt || [])]
      updatedItemsAlt[index] = newAltText
      
      const { error } = await PortfolioService.updatePortfolioPage({
        itemsAlt: updatedItemsAlt
      })
      
      if (error) {
        setError(error)
      } else {
        setSuccess('Alt text updated successfully')
        // Update the local state to reflect the change
        setPortfolio(prev => {
          if (!prev) return prev
          const newItemsAlt = [...(prev.itemsAlt || [])]
          newItemsAlt[index] = newAltText
          return { ...prev, itemsAlt: newItemsAlt }
        })
      }
    } catch (err) {
      setError('Failed to update alt text')
    } finally {
      setSaving(false)
    }
  }

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
          <div className="space-y-2">
            <Label htmlFor="heroBackgroundImageAlt">Hero Background Image Alt Text</Label>
            <Input
              id="heroBackgroundImageAlt"
              value={heroBackgroundImageAlt}
              onChange={(e) => setHeroBackgroundImageAlt(e.target.value)}
              placeholder="Describe the hero background image"
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
                <Button 
                  variant="outline" 
                  className="w-full h-10 px-3 justify-start text-left font-normal"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
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
              
              {/* Alt Text for New Item */}
              <div className="space-y-2">
                <Label htmlFor="newItemAlt">Alt Text</Label>
                <Input
                  id="newItemAlt"
                  value={newItemAlt}
                  onChange={(e) => setNewItemAlt(e.target.value)}
                  placeholder="Describe the portfolio item image"
                />
              </div>
              
              <Button onClick={handleAddItem} disabled={saving || !newItemImage}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Portfolio Items List - Updated to Table/List View */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Alt Text</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      <Image className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2">No portfolio items found</p>
                      <p className="text-sm">Add your first portfolio item using the form above</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  portfolio.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <img 
                            src={item.image} 
                            alt={portfolio.itemsAlt?.[index] || `Portfolio item ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingItemIndex === index ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editingItemAlt}
                              onChange={(e) => setEditingItemAlt(e.target.value)}
                              placeholder="Enter alt text"
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                handleEditItemAlt(index, editingItemAlt)
                                setEditingItemIndex(null)
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingItemIndex(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="max-w-xs truncate text-sm text-muted-foreground">
                              {portfolio.itemsAlt?.[index] || 'No alt text'}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingItemIndex(index)
                                setEditingItemAlt(portfolio.itemsAlt?.[index] || '')
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteItem(index)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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