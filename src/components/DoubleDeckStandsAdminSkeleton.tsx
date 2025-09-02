import { Skeleton } from '@/components/ui/skeleton'

export function DoubleDeckStandsAdminSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* SEO Meta Section */}
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-48" />
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
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-48" />
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
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-48" />
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
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-56" />
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
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-64" />
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

      {/* Section 5: Exhibition Benefits Section */}
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-64" />
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

      {/* Section 6: Booth Partner Section */}
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-56" />
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
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>

      {/* Section 7: Bold Statement Section */}
      <div className="space-y-4 p-6 border rounded-lg">
        <Skeleton className="h-6 w-56" />
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
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}