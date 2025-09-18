import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Plus, Edit, Trash2, Eye, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useBlogPosts } from '@/hooks/useBlogContent'
import { BlogService } from '@/data/blogService'

export function BlogPostsAdmin() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const { data: blogPosts, totalCount, loading, error, refetch } = useBlogPosts(currentPage, pageSize)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogPostToDelete, setBlogPostToDelete] = useState<{id: string, title: string} | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [allBlogPosts, setAllBlogPosts] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize)

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app'

  // Get all blog posts for global search and sorting
  const getAllBlogPosts = async () => {
    if (!searchTerm) return
    setSearchLoading(true)
    try {
      const { data, error } = await BlogService.getBlogPosts()
      if (error) throw new Error(error)
      // Sort by created date (newest first) when searching
      const sortedData = data?.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || []
      setAllBlogPosts(sortedData)
    } catch (error: any) {
      console.error('Error fetching all blog posts:', error)
      toast.error('Failed to search blog posts')
    } finally {
      setSearchLoading(false)
    }
  }

  // Effect to fetch all blog posts when search term changes
  useEffect(() => {
    if (searchTerm) {
      getAllBlogPosts()
    } else {
      setAllBlogPosts([])
    }
  }, [searchTerm])

  // Filter all blog posts based on search term
  const globalFilteredBlogPosts = useMemo(() => {
    if (!allBlogPosts.length || !searchTerm) return []
    
    const term = searchTerm.toLowerCase()
    return allBlogPosts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
      (post.author && post.author.toLowerCase().includes(term))
    )
  }, [allBlogPosts, searchTerm])

  // Sort blog posts by created date (newest first) for regular view
  const sortedBlogPosts = useMemo(() => {
    if (!blogPosts) return []
    return [...blogPosts].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [blogPosts])

  // Filter blog posts based on search term
  const filteredBlogPosts = useMemo(() => {
    if (!sortedBlogPosts || !searchTerm) return sortedBlogPosts || []
    
    const term = searchTerm.toLowerCase()
    return sortedBlogPosts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
      (post.author && post.author.toLowerCase().includes(term))
    )
  }, [sortedBlogPosts, searchTerm])

  // Determine which blog posts to display
  const displayBlogPosts = searchTerm ? globalFilteredBlogPosts : filteredBlogPosts
  const displayTotalCount = searchTerm ? globalFilteredBlogPosts.length : totalCount

  const handleCreateBlogPost = () => {
    navigate('/admin/blog-posts/create')
  }

  const handleEditBlogPost = (id: string) => {
    navigate(`/admin/blog-posts/${id}/edit`)
  }

  const confirmDeleteBlogPost = (id: string, title: string) => {
    setBlogPostToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  const handleDeleteBlogPost = async () => {
    if (!blogPostToDelete) return

    try {
      const { error } = await BlogService.deleteBlogPost(blogPostToDelete.id)

      if (error) throw new Error(error)

      toast.success('Blog post deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setBlogPostToDelete(null)
    } catch (error: any) {
      console.error('Error deleting blog post:', error)
      toast.error('Failed to delete blog post')
      setDeleteDialogOpen(false)
      setBlogPostToDelete(null)
    }
  }

  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPaginationItems = () => {
    const items = []
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => goToPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )
    
    if (totalPages <= 1) return items
    
    // Show ellipsis if there are pages between first and current range
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    // Show ellipsis if there are pages between current range and last
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => goToPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    return items
  }

  if (loading && !searchLoading) {
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
      <div className="p-8 text-center text-red-600">
        Error loading blog posts: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the blog post "{blogPostToDelete?.title}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlogPost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage blog posts
          </p>
        </div>
        <Button onClick={handleCreateBlogPost}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchLoading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        {searchTerm && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSearchTerm('')}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-600 mt-1">
            {searchTerm 
              ? `Found ${displayTotalCount} result${displayTotalCount !== 1 ? 's' : ''} for "${searchTerm}"` 
              : `Showing ${Math.min(displayBlogPosts.length, pageSize)} of ${totalCount} blog posts`}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayBlogPosts.map((blogPost) => (
              <TableRow key={blogPost.id}>
                <TableCell className="font-medium">{blogPost.title}</TableCell>
                <TableCell>
                  {blogPost.createdAt 
                    ? new Date(blogPost.createdAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {blogPost.updatedAt 
                    ? new Date(blogPost.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${websiteUrl}/blog/${blogPost.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBlogPost(blogPost.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteBlogPost(blogPost.id, blogPost.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {displayBlogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No blog posts found matching your search' : 'No blog posts found'}
            </p>
            {!searchTerm && (
              <Button
                variant="default"
                className="mt-4"
                onClick={handleCreateBlogPost}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Blog Post
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!searchTerm && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}