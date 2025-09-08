import { useState, useEffect } from 'react'
import { ServicesPageService } from '@/data/servicesService'
import type { ServicesPage, ServiceItem } from '@/data/servicesTypes'

export const useServicesPage = () => {
  const [data, setData] = useState<ServicesPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServicesPage = async () => {
    try {
      setLoading(true)
      const { data: servicesPage, error: fetchError } = await ServicesPageService.getServicesPage()
      
      if (fetchError) {
        setError(fetchError)
        setData(null)
      } else {
        setData(servicesPage)
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch services page')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const updateServicesPage = async (id: string, updates: Partial<ServicesPage>) => {
    try {
      const { data: updatedData, error: updateError } = await ServicesPageService.updateServicesPage(id, updates)
      
      if (updateError) {
        throw new Error(updateError)
      }
      
      if (updatedData) {
        setData(updatedData)
      }
      
      return { data: updatedData, error: updateError }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update services page'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const createServiceItem = async (serviceItem: Omit<ServiceItem, 'id'>) => {
    try {
      const { data: createdItem, error: createError } = await ServicesPageService.createServiceItem(serviceItem)
      
      if (createError) {
        throw new Error(createError)
      }
      
      if (createdItem && data) {
        setData({
          ...data,
          services: [...data.services, createdItem]
        })
      }
      
      return { data: createdItem, error: createError }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service item'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateServiceItem = async (id: string, updates: Partial<ServiceItem>) => {
    try {
      const { data: updatedItem, error: updateError } = await ServicesPageService.updateServiceItem(id, updates)
      
      if (updateError) {
        throw new Error(updateError)
      }
      
      if (updatedItem && data) {
        setData({
          ...data,
          services: data.services.map(service => 
            service.id === id ? { ...service, ...updatedItem } : service
          )
        })
      }
      
      return { data: updatedItem, error: updateError }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update service item'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteServiceItem = async (id: string) => {
    try {
      const { data: deleted, error: deleteError } = await ServicesPageService.deleteServiceItem(id)
      
      if (deleteError) {
        throw new Error(deleteError)
      }
      
      if (deleted && data) {
        setData({
          ...data,
          services: data.services.filter(service => service.id !== id)
        })
      }
      
      return { data: deleted, error: deleteError }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete service item'
      setError(errorMessage)
      return { data: false, error: errorMessage }
    }
  }

  const uploadImage = async (file: File, folder?: string) => {
    try {
      const { data: imageUrl, error: uploadError } = await ServicesPageService.uploadImage(file, folder)
      
      if (uploadError) {
        throw new Error(uploadError)
      }
      
      return { data: imageUrl, error: uploadError }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchServicesPage()
  }, [])

  return {
    data,
    loading,
    error,
    fetchServicesPage,
    updateServicesPage,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
    uploadImage
  }
}