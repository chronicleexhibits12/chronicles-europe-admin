import { useState, useEffect } from 'react'
import { TestimonialsPageService } from '@/data/testimonialsService'
import type { TestimonialsPage, TestimonialItem } from '@/data/testimonialsTypes'

export function useTestimonialsPage() {
  const [data, setData] = useState<TestimonialsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonialsPage = async () => {
    try {
      setLoading(true)
      const { data: pageData, error: fetchError } = await TestimonialsPageService.getTestimonialsPage()
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setData(pageData || null)
      }
    } catch (err) {
      setError('Failed to fetch testimonials page')
      console.error('Error fetching testimonials page:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateTestimonialsPage = async (id: string, updates: Partial<TestimonialsPage>) => {
    try {
      const { data: updatedData, error: updateError } = await TestimonialsPageService.updateTestimonialsPage(id, updates)
      
      if (updateError) {
        return { data: null, error: updateError }
      }
      
      if (updatedData) {
        setData(updatedData)
      }
      
      return { data: updatedData, error: null }
    } catch (err) {
      console.error('Error updating testimonials page:', err)
      return { data: null, error: 'Failed to update testimonials page' }
    }
  }

  const updateTestimonials = async (pageId: string, testimonials: TestimonialItem[]) => {
    try {
      const { data: updatedTestimonials, error: updateError } = await TestimonialsPageService.updateTestimonials(pageId, testimonials)
      
      if (updateError) {
        return { data: null, error: updateError }
      }
      
      // Update the local state with the new testimonials
      if (updatedTestimonials && data) {
        setData({
          ...data,
          testimonials: updatedTestimonials
        })
      }
      
      return { data: updatedTestimonials, error: null }
    } catch (err) {
      console.error('Error updating testimonials:', err)
      return { data: null, error: 'Failed to update testimonials' }
    }
  }

  const uploadImage = async (file: File, folder?: string) => {
    try {
      const { data: url, error: uploadError } = await TestimonialsPageService.uploadImage(file, folder)
      
      if (uploadError) {
        return { data: null, error: uploadError }
      }
      
      return { data: url, error: null }
    } catch (err) {
      console.error('Error uploading image:', err)
      return { data: null, error: 'Failed to upload image' }
    }
  }

  useEffect(() => {
    fetchTestimonialsPage()
  }, [])

  const refetch = () => {
    fetchTestimonialsPage()
  }

  return {
    data,
    loading,
    error,
    updateTestimonialsPage,
    updateTestimonials,
    uploadImage,
    refetch
  }
}