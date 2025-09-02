import React from 'react'
import { useDoubleDeckStandsContent } from '../hooks/useDoubleDeckStandsContent'
import { Loader2 } from 'lucide-react'

export function DoubleDeckStands() {
  const { content, loading, error } = useDoubleDeckStandsContent()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Content Available</h1>
          <p className="text-gray-600">Double decker stands content is not available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${content.hero?.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {content.hero?.title}
          </h1>
          <p className="text-xl md:text-2xl font-light">
            {content.hero?.subtitle}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      {content.benefits && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  {content.benefits.title}
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: content.benefits.content }}
                />
              </div>
              {content.benefits.image && (
                <div className="order-first md:order-last">
                  <img 
                    src={content.benefits.image} 
                    alt="Double Decker Benefits"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Points Table Section */}
      {content.pointsTable && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              {content.pointsTable.title}
            </h2>
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: content.pointsTable.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Stand Project Text Section */}
      {content.standProjectText && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              {content.standProjectText.title}
            </h2>
            <h3 className="text-4xl font-bold mb-8 text-blue-600">
              {content.standProjectText.highlight}
            </h3>
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: content.standProjectText.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Exhibition Benefits Section */}
      {content.exhibitionBenefits && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {content.exhibitionBenefits.image && (
                <div>
                  <img 
                    src={content.exhibitionBenefits.image} 
                    alt="Exhibition Benefits"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {content.exhibitionBenefits.title}
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  {content.exhibitionBenefits.subtitle}
                </p>
                <div 
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: content.exhibitionBenefits.content }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booth Partner Section */}
      {content.boothPartner && (
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {content.boothPartner.title}
            </h2>
            <h3 className="text-2xl font-light mb-8">
              {content.boothPartner.subtitle}
            </h3>
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-white prose-invert"
                dangerouslySetInnerHTML={{ __html: content.boothPartner.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Bold Statement Section */}
      {content.boldStatement && (
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {content.boldStatement.title}
            </h2>
            <h3 className="text-3xl font-light mb-8 text-blue-400">
              {content.boldStatement.subtitle}
            </h3>
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-gray-300 prose-invert"
                dangerouslySetInnerHTML={{ __html: content.boldStatement.description }}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}