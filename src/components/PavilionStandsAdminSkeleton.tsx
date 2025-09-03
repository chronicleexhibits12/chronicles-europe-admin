import { Skeleton } from '@/components/ui/skeleton'

export function PavilionStandsAdminSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Form Sections */}
      <div className="space-y-8">
        {/* SEO Meta Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>

        {/* Section 1: Hero Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-16" />
              </div>
              <Skeleton className="h-20 w-32 mt-2" />
            </div>
          </div>
        </div>

        {/* Section 2: Benefits Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-16" />
              </div>
              <Skeleton className="h-20 w-32 mt-2" />
            </div>
            <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>

        {/* Section 3: Points Table Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-56 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>

        {/* Section 4: Stand Project Text Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-64 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>

        {/* Section 5: Advantages Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-64 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-16" />
              </div>
              <Skeleton className="h-20 w-32 mt-2" />
            </div>
            <div>
              <Skeleton className="h-4 w-56 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>

        {/* Section 6: Our Expertise Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-56 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>

        {/* Section 7: Company Info Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-56 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  )
}