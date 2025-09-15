import { useState, useMemo } from 'react'
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
  const [updatingPostId, setUpdatingPostId] = useState<string | null>(null)

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize)

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app'

  // Filter blog posts based on search term
  const filteredBlogPosts = useMemo(() => {
    if (!blogPosts || !searchTerm) return blogPosts || []
    
    const term = searchTerm.toLowerCase()
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(term)
    )
  }, [blogPosts, searchTerm])

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

  const toggleBlogPostStatus = async (blogPost: any) => {
    setUpdatingPostId(blogPost.id)
    try {
      // Toggle the isActive status
      const { error } = await BlogService.updateBlogPost(blogPost.id, {
        ...blogPost,
        isActive: !blogPost.isActive
      });
      
      if (error) throw new Error(error);
      
      toast.success(`Blog post ${!blogPost.isActive ? 'published' : 'unpublished'} successfully`);
      refetch();
    } catch (error: any) {
      console.error('Error updating blog post status:', error);
      toast.error('Failed to update blog post status');
    } finally {
      setUpdatingPostId(null)
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

      {/* Updating Status Popup */}
      <Dialog open={updatingPostId !== null}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <DialogTitle className="text-center mb-2">Updating Status</DialogTitle>
            <DialogDescription className="text-center">
              Please wait while we update the blog post status...
            </DialogDescription>
          </div>
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
            List of all blog posts in the system
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogPosts.map((blogPost) => (
              <TableRow key={blogPost.id}>
                <TableCell className="font-medium">{blogPost.title}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleBlogPostStatus(blogPost)}
                    disabled={updatingPostId === blogPost.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      blogPost.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    } ${updatingPostId === blogPost.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        blogPost.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
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

        {filteredBlogPosts.length === 0 && (
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
      {totalPages > 1 && (
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