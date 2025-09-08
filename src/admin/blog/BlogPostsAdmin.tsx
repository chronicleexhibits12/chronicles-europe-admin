import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useBlogPosts } from '@/hooks/useBlogContent'
import { BlogService } from '@/data/blogService'

export function BlogPostsAdmin() {
  const navigate = useNavigate()
  const { data: blogPosts, loading, error, refetch } = useBlogPosts()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogPostToDelete, setBlogPostToDelete] = useState<{id: string, title: string} | null>(null)

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app'

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
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((blogPost) => (
              <TableRow key={blogPost.id}>
                <TableCell className="font-medium">{blogPost.title}</TableCell>
                <TableCell>{blogPost.category || 'N/A'}</TableCell>
                <TableCell>{blogPost.author || 'N/A'}</TableCell>
                <TableCell>
                  {blogPost.publishedDate 
                    ? new Date(blogPost.publishedDate).toLocaleDateString()
                    : 'Not published'}
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

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found</p>
            <Button
              variant="default"
              className="mt-4"
              onClick={handleCreateBlogPost}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Blog Post
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}