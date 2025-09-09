import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useContactPage } from '@/hooks/useContactContent'
import { ContactPageService } from '@/data/contactService'
import { ContactAdminSkeleton } from '@/components/ContactAdminSkeleton'
import { TagInput } from '@/components/ui/tag-input'
import type { ContactPage, ContactOffice, ContactSupportItem } from '@/data/contactTypes'

export function ContactAdmin() {
  const { data: contactPage, loading, error, updateContactPage } = useContactPage()
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<ContactPage>>({})
  
  // Update form data when contact page loads
  useEffect(() => {
    if (contactPage) {
      setFormData(contactPage)
    }
  }, [contactPage])

  const handleMetaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...(prev.meta || { title: '', description: '', keywords: '' }),
        [field]: value
      }
    }))
  }

  const handleHeroChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...(prev.hero || { title: '' }),
        [field]: value
      }
    }))
  }

  const handleContactInfoChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...(prev.contactInfo || { title: '', address: '', fullAddress: '', phone: ['', ''], email: '' }),
        [field]: value
      }
    }))
  }

  const handleOtherOfficesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      otherOffices: {
        ...(prev.otherOffices || { title: '', offices: [] }),
        [field]: value
      }
    }))
  }

  const handleSupportChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      support: {
        ...(prev.support || { title: '', description: '', items: [] }),
        [field]: value
      }
    }))
  }

  const handleMapChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      map: {
        ...(prev.map || { embedUrl: '' }),
        [field]: value
      }
    }))
  }

  // Form Fields handlers
  const updateFormField = (index: number, field: string, value: string | boolean) => {
    setFormData(prev => {
      const formFields = [...(prev.formFields || [])]
      formFields[index] = { ...formFields[index], [field]: value }
      return { ...prev, formFields }
    })
  }

  // Offices handlers
  const updateOffice = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const offices = [...((prev.otherOffices?.offices as ContactOffice[]) || [])]
      offices[index] = { ...offices[index], [field]: value }
      return {
        ...prev,
        otherOffices: {
          ...(prev.otherOffices || { title: '', offices: [] }),
          offices
        }
      }
    })
  }

  // Support items handlers
  const updateSupportItem = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const items = [...((prev.support?.items as ContactSupportItem[]) || [])]
      items[index] = { ...items[index], [field]: value }
      return {
        ...prev,
        support: {
          ...(prev.support || { title: '', description: '', items: [] }),
          items
        }
      }
    })
  }

  const handleSave = async () => {
    if (!contactPage?.id) return

    setSaving(true)
    
    const savePromise = updateContactPage(contactPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          return 'Contact page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await ContactPageService.triggerRevalidation()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <ContactAdminSkeleton />
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading contact page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Contact Page Content</h1>
        <p className="text-muted-foreground">Edit your contact page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8">
        {/* Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={formData.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                placeholder="Enter hero title"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Contact Info Section</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="contact-title">Title</Label>
              <Input
                id="contact-title"
                value={formData.contactInfo?.title || ''}
                onChange={(e) => handleContactInfoChange('title', e.target.value)}
                placeholder="Enter contact info title"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-address">Address</Label>
                <Input
                  id="contact-address"
                  value={formData.contactInfo?.address || ''}
                  onChange={(e) => handleContactInfoChange('address', e.target.value)}
                  placeholder="Enter address"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-full-address">Full Address</Label>
                <Input
                  id="contact-full-address"
                  value={formData.contactInfo?.fullAddress || ''}
                  onChange={(e) => handleContactInfoChange('fullAddress', e.target.value)}
                  placeholder="Enter full address"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-phone-1">Phone 1</Label>
                <Input
                  id="contact-phone-1"
                  value={formData.contactInfo?.phone?.[0] || ''}
                  onChange={(e) => handleContactInfoChange('phone', [e.target.value, formData.contactInfo?.phone?.[1] || ''])}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-phone-2">Phone 2</Label>
                <Input
                  id="contact-phone-2"
                  value={formData.contactInfo?.phone?.[1] || ''}
                  onChange={(e) => handleContactInfoChange('phone', [formData.contactInfo?.phone?.[0] || '', e.target.value])}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="w-full">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Form Fields Configuration */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Form Fields Configuration</h2>
          
          <div className="space-y-4">
            {formData.formFields?.map((field, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-medium">Form Field {index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={field.name}
                      onChange={(e) => updateFormField(index, 'name', e.target.value)}
                      placeholder="Field name"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="w-full">
                  <Label>Placeholder</Label>
                  <Input
                    value={field.placeholder}
                    onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                    placeholder="Placeholder text"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${index}`}
                    checked={field.required}
                    onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`required-${index}`}>Required Field</Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Offices Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Other Offices Section</h2>
          
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="offices-title">Title</Label>
              <Input
                id="offices-title"
                value={formData.otherOffices?.title || ''}
                onChange={(e) => handleOtherOfficesChange('title', e.target.value)}
                placeholder="Enter other offices title"
                className="mt-1"
              />
            </div>
            
            {formData.otherOffices?.offices?.map((office, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-medium">Office {index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={office.name}
                      onChange={(e) => updateOffice(index, 'name', e.target.value)}
                      placeholder="Office name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={office.phone}
                      onChange={(e) => updateOffice(index, 'phone', e.target.value)}
                      placeholder="Phone number"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Address</Label>
                    <Input
                      value={office.address}
                      onChange={(e) => updateOffice(index, 'address', e.target.value)}
                      placeholder="Office address"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={office.email}
                      onChange={(e) => updateOffice(index, 'email', e.target.value)}
                      placeholder="Email address"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="w-full">
                  <Label>Website</Label>
                  <Input
                    value={office.website}
                    onChange={(e) => updateOffice(index, 'website', e.target.value)}
                    placeholder="Website URL"
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Support Section</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="support-title">Title</Label>
                <Input
                  id="support-title"
                  value={formData.support?.title || ''}
                  onChange={(e) => handleSupportChange('title', e.target.value)}
                  placeholder="Enter support title"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="w-full">
              <Label htmlFor="support-description">Description</Label>
              <Textarea
                id="support-description"
                value={formData.support?.description || ''}
                onChange={(e) => handleSupportChange('description', e.target.value)}
                placeholder="Enter support description"
                className="mt-1"
              />
            </div>
            
            <div className="space-y-4">
              {formData.support?.items?.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <h3 className="font-medium">Support Item {index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Icon</Label>
                      <Input
                        value={item.icon}
                        onChange={(e) => updateSupportItem(index, 'icon', e.target.value)}
                        placeholder="Icon name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateSupportItem(index, 'title', e.target.value)}
                        placeholder="Item title"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateSupportItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Map Section</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="map-embed">Embed URL</Label>
              <Textarea
                id="map-embed"
                value={formData.map?.embedUrl || ''}
                onChange={(e) => handleMapChange('embedUrl', e.target.value)}
                placeholder="Enter map embed URL"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Information */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Meta Information</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={formData.meta?.title || ''}
                onChange={(e) => handleMetaChange('title', e.target.value)}
                placeholder="Enter meta title"
                className="mt-1"
              />
            </div>
            
            <div className="w-full">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleMetaChange('description', e.target.value)}
                placeholder="Enter meta description"
                className="mt-1"
              />
            </div>
            
            <div className="w-full">
              <Label>Meta Keywords</Label>
              <TagInput
                tags={formData.meta?.keywords?.split(',').map(tag => tag.trim()).filter(tag => tag) || []}
                onChange={(tags) => handleMetaChange('keywords', tags.join(', '))}
                placeholder="Enter meta keywords"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
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