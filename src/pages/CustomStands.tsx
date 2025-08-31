import { useEffect } from 'react'
import { useCustomStandsPage } from '@/hooks/useCustomStandsContent'
import { Loader2 } from 'lucide-react'

export function CustomStands() {
  const { data: content, loading, error } = useCustomStandsPage()

  useEffect(() => {
    if (content?.meta?.title) {
      document.title = content.meta.title
    }
    if (content?.meta?.description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', content.meta.description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = content.meta.description
        document.head.appendChild(meta)
      }
    }
  }, [content])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-2">No Content</h1>
          <p className="text-gray-500">Custom stands page content not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {content.hero && (
        <section 
          className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ 
            backgroundImage: content.hero.backgroundImage ? `url(${content.hero.backgroundImage})` : 'none',
            backgroundColor: !content.hero.backgroundImage ? '#f3f4f6' : 'transparent'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center text-white px-4">
            {content.hero.title && (
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {content.hero.title}
              </h1>
            )}
            {content.hero.subtitle && (
              <h2 className="text-xl md:text-2xl font-semibold">
                {content.hero.subtitle}
              </h2>
            )}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Benefits Section */}
        {content.benefits && (
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {content.benefits.title && (
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {content.benefits.title}
                </h2>
              )}
              {content.benefits.content && (
                <div 
                  className="prose prose-lg max-w-none content-styles"
                  dangerouslySetInnerHTML={{ __html: content.benefits.content }}
                />
              )}
            </div>
            {content.benefits.image && (
              <div className="order-first md:order-last">
                <img 
                  src={content.benefits.image} 
                  alt="Benefits" 
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </section>
        )}

        {/* Stand Project Text Section */}
        {content.standProjectText && (
          <section className="text-center">
            {content.standProjectText.title && (
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {content.standProjectText.title}
              </h2>
            )}
            {content.standProjectText.highlight && (
              <h3 className="text-3xl font-bold mb-6 text-blue-600">
                {content.standProjectText.highlight}
              </h3>
            )}
            {content.standProjectText.description && (
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: content.standProjectText.description }} />
              </p>
            )}
          </section>
        )}

        {/* Exhibition Benefits Section */}
        {content.exhibitionBenefits && (
          <section className="grid md:grid-cols-2 gap-8 items-center">
            {content.exhibitionBenefits.image && (
              <div>
                <img 
                  src={content.exhibitionBenefits.image} 
                  alt="Exhibition Benefits" 
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            <div>
              {content.exhibitionBenefits.title && (
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                  {content.exhibitionBenefits.title}
                </h2>
              )}
              {content.exhibitionBenefits.subtitle && (
                <h3 className="text-xl text-blue-600 mb-6">
                  {content.exhibitionBenefits.subtitle}
                </h3>
              )}
              {content.exhibitionBenefits.content && (
                <div 
                  className="prose prose-lg max-w-none content-styles"
                  dangerouslySetInnerHTML={{ __html: content.exhibitionBenefits.content }}
                />
              )}
            </div>
          </section>
        )}

        {/* Bespoke Section */}
        {content.bespoke && (
          <section className="text-center bg-gray-50 p-8 rounded-lg">
            {content.bespoke.title && (
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {content.bespoke.title}
              </h2>
            )}
            {content.bespoke.subtitle && (
              <h3 className="text-3xl font-bold mb-6 text-blue-600">
                {content.bespoke.subtitle}
              </h3>
            )}
            {content.bespoke.description && (
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                {content.bespoke.description}
              </p>
            )}
          </section>
        )}

        {/* Fresh Design Section */}
        {content.freshDesign && (
          <section className="text-center">
            {content.freshDesign.title && (
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {content.freshDesign.title}
              </h2>
            )}
            {content.freshDesign.subtitle && (
              <h3 className="text-3xl font-bold mb-6 text-blue-600">
                {content.freshDesign.subtitle}
              </h3>
            )}
            {content.freshDesign.description && (
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                {content.freshDesign.description}
              </p>
            )}
          </section>
        )}

        {/* Cost Section */}
        {content.costSection && (
          <section className="text-center bg-blue-50 p-8 rounded-lg">
            {content.costSection.title && (
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {content.costSection.title}
              </h2>
            )}
            {content.costSection.subtitle && (
              <h3 className="text-3xl font-bold mb-6 text-blue-600">
                {content.costSection.subtitle}
              </h3>
            )}
            {content.costSection.description && (
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                {content.costSection.description}
              </p>
            )}
          </section>
        )}

        {/* Points Table Section */}
        {content.pointsTable && (
          <section className="bg-white border rounded-lg p-8 shadow-sm">
            {content.pointsTable.title && (
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
                {content.pointsTable.title}
              </h2>
            )}
            {content.pointsTable.content && (
              <div 
                className="prose prose-lg max-w-none content-styles"
                dangerouslySetInnerHTML={{ __html: content.pointsTable.content }}
              />
            )}
          </section>
        )}
      </div>
    </div>
  )
}