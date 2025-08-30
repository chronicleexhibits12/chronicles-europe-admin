import { useState, useEffect } from 'react'
import { AboutPageService } from '@/data/aboutService'
import type { AboutPage } from '@/data/aboutTypes'

export function useAboutPage() {
    const [data, setData] = useState<AboutPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAboutPage = async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await AboutPageService.getAboutPage()

            if (result.error) {
                setError(result.error)
                setData(null)
            } else {
                setData(result.data)
                setError(null)
            }
        } catch (err) {
            setError('Failed to fetch about page')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const updateAboutPage = async (id: string, updateData: Partial<AboutPage>) => {
        try {
            const result = await AboutPageService.updateAboutPage(id, updateData)

            if (result.data && !result.error) {
                setData(result.data)
            }

            return result
        } catch (err) {
            return { data: null, error: 'Failed to update about page' }
        }
    }

    const uploadImage = async (file: File, folder?: string) => {
        try {
            const result = await AboutPageService.uploadImage(file, folder)
            return result
        } catch (err) {
            return { data: null, error: 'Failed to upload image' }
        }
    }

    const deleteImage = async (url: string) => {
        try {
            const result = await AboutPageService.deleteImage(url)
            return result
        } catch (err) {
            return { data: false, error: 'Failed to delete image' }
        }
    }

    useEffect(() => {
        fetchAboutPage()
    }, [])

    return {
        data,
        loading,
        error,
        refetch: fetchAboutPage,
        updateAboutPage,
        uploadImage,
        deleteImage
    }
}