import { Skeleton } from '@/components/ui/skeleton'

export function HomeAdminSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Form Sections */}
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 border-b pb-2" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-16" />
            </div>
            <Skeleton className="h-32 w-full mt-2 rounded" />
          </div>
        </div>

        {/* Main Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
          </div>
        </div>

        {/* Exhibition Europe */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-16" />
              </div>
              <Skeleton className="h-32 w-full mt-2 rounded" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
          </div>
        </div>

        {/* Exhibition USA */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-12 mb-1" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-20 w-full rounded" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-16" />
                      </div>
                      <Skeleton className="h-24 w-full mt-2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Best */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 border-b pb-2" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-32 w-full rounded" />
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