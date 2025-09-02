import { useModularStandsContent } from '@/hooks/useModularStandsContent'
import { Loader2 } from 'lucide-react'

export function ModularStands() {
  const { content, loading, error } = useModularStandsContent()

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
          <p className="text-gray-500">Modular stands content not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{content.hero.title}</h1>
          <p className="text-xl md:text-2xl">{content.hero.subtitle}</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{content.benefits.title}</h2>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.benefits.content }}
            />
          </div>
          <div>
            <img 
              src={content.benefits.image} 
              alt="Benefits" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Points Table Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">{content.pointsTable.title}</h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.pointsTable.content }}
          />
        </div>
      </section>

      {/* Stand Project Text Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            {content.standProjectText.title} <span className="text-blue-600">{content.standProjectText.highlight}</span>
          </h2>
          <div 
            className="prose prose-lg max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: content.standProjectText.description }}
          />
        </div>
      </section>

      {/* Exhibition Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src={content.exhibitionBenefits.image} 
                alt="Exhibition Benefits" 
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">{content.exhibitionBenefits.title}</h2>
              <p className="text-lg text-gray-600 mb-6">{content.exhibitionBenefits.subtitle}</p>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content.exhibitionBenefits.content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modular Diversity Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">
            {content.modularDiversity.title} <span className="text-blue-600">{content.modularDiversity.subtitle}</span>
          </h2>
          <div 
            className="prose prose-lg max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: content.modularDiversity.content }}
          />
        </div>
      </section>

      {/* Fastest Construction Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-2">{content.fastestConstruction.title}</h2>
          <h3 className="text-2xl font-semibold mb-8">{content.fastestConstruction.subtitle}</h3>
          <div 
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content.fastestConstruction.description }}
          />
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">
            {content.experts.title} <span className="text-blue-600">{content.experts.subtitle}</span>
          </h2>
          <div 
            className="prose prose-lg max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: content.experts.description }}
          />
        </div>
      </section>
    </div>
  )
}