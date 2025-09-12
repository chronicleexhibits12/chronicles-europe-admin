import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useServicesPage } from '@/hooks/useServicesContent'
import type { ServicesPage, ServiceItem } from '@/data/servicesTypes'
import { ServicesPageService } from '@/data/servicesService'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function ServicesAdmin() {
  const { data: servicesPage, loading, error, updateServicesPage, createServiceItem, updateServiceItem, deleteServiceItem } = useServicesPage()
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<ServicesPage>>({})

  // Update form data when services page loads
  useEffect(() => {
    if (servicesPage) {
      setFormData(servicesPage)
    }
  }, [servicesPage])

  const handleInputChange = (section: keyof ServicesPage, field: string, value: string) => {
    setFormData(prev => {
      const currentSection = (prev[section] as any) || {}
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      }
    })
  }

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: string) => {
    setFormData(prev => {
      const services = [...(prev.services || [])]
      services[index] = { ...services[index], [field]: value }
      return { ...prev, services }
    })
  }

  const addServiceItem = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...(prev.services || []),
        { id: Date.now().toString(), title: '', descriptionHtml: '' }
      ]
    }))
  }

  const removeServiceItem = async (index: number, id?: string) => {
    // If it's an existing service item (has an ID), delete it from the database
    if (id && id.length > 0 && id !== 'undefined') {
      try {
        await deleteServiceItem(id)
        toast.success('Service item deleted successfully!')
      } catch (error) {
        toast.error(`Failed to delete service item: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return
      }
    }
    
    // Remove from form data
    setFormData(prev => {
      const services = [...(prev.services || [])]
      services.splice(index, 1)
      return { ...prev, services }
    })
  }

  const saveServiceItem = async (index: number, id?: string) => {
    const serviceItem = formData.services?.[index]
    if (!serviceItem) return

    try {
      if (id && id.length > 0 && id !== 'undefined') {
        // Update existing service item
        const result = await updateServiceItem(id, {
          title: serviceItem.title,
          descriptionHtml: serviceItem.descriptionHtml
        })
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        toast.success('Service item updated successfully!')
      } else {
        // Create new service item
        const result = await createServiceItem({
          title: serviceItem.title,
          descriptionHtml: serviceItem.descriptionHtml
        })
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        // Update the form data with the new ID
        if (result.data) {
          setFormData(prev => {
            const services = [...(prev.services || [])]
            services[index] = result.data!
            return { ...prev, services }
          })
        }
        
        toast.success('Service item created successfully!')
      }
      
      // Trigger revalidation
      await ServicesPageService.triggerRevalidation()
    } catch (error) {
      toast.error(`Failed to save service item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleSave = async () => {
    if (!servicesPage?.id) return

    setSaving(true)
    
    const savePromise = updateServicesPage(servicesPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          return 'Services page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await ServicesPageService.triggerRevalidation()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading services page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Services Page Content</h1>
        <p className="text-muted-foreground">Edit your services page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8">
        {/* Section 1: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1 (Hero Section)</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={formData.hero?.title || ''}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                  placeholder="Enter hero title"
                />
              </div>
              
              <div>
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={formData.hero?.subtitle || ''}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                  placeholder="Enter hero subtitle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Intro Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2 (Intro Section)</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="intro-title">Intro Title</Label>
              <Input
                id="intro-title"
                value={formData.intro?.title || ''}
                onChange={(e) => handleInputChange('intro', 'title', e.target.value)}
                placeholder="Enter intro title"
              />
            </div>
            
            <div>
              <Label htmlFor="intro-description">Intro Description</Label>
              <RichTextEditor
                content={formData.intro?.descriptionHtml || ''}
                onChange={(content) => handleInputChange('intro', 'descriptionHtml', content)}
                placeholder="Enter intro description..."
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Services Items */}
        <div className="admin-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold border-b pb-2">Section 3 (Services Items)</h2>
            <Button type="button" onClick={addServiceItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          <div className="space-y-6">
            {formData.services?.map((service, index) => (
              <div key={service.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Service {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeServiceItem(index, service.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`service-title-${index}`}>Service Title</Label>
                    <Input
                      id={`service-title-${index}`}
                      value={service.title || ''}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                      placeholder="Enter service title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`service-description-${index}`}>Service Description</Label>
                    <RichTextEditor
                      content={service.descriptionHtml || ''}
                      onChange={(content) => handleServiceChange(index, 'descriptionHtml', content)}
                      placeholder="Enter service description..."
                      controlled={true}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => saveServiceItem(index, service.id)}
                      variant="outline"
                      size="sm"
                    >
                      Save Service Item
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {(!formData.services || formData.services.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No services added yet. Click "Add Service" to create your first service.</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Metadata Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta-title">SEO Title</Label>
              <Input
                id="meta-title"
                value={formData.meta?.title || ''}
                onChange={(e) => handleInputChange('meta', 'title', e.target.value)}
                placeholder="SEO title for the services page"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleInputChange('meta', 'description', e.target.value)}
                placeholder="SEO description for the services page"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="meta-keywords">SEO Keywords</Label>
              <Input
                id="meta-keywords"
                value={formData.meta?.keywords || ''}
                onChange={(e) => handleInputChange('meta', 'keywords', e.target.value)}
                placeholder="SEO keywords for the services page (comma separated)"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}