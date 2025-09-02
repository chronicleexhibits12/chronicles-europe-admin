import { usePavilionStandsContent } from '@/hooks/usePavilionStandsContent'
import { Helmet } from '@dr.pogodin/react-helmet'

export function PavilionStands() {
  const { content: data, loading, error } = usePavilionStandsContent()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Page</h1>
          <p className="text-muted-foreground">{error || 'Failed to load pavilion stands content'}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{data.meta?.title || 'Pavilion Stands'}</title>
        <meta name="description" content={data.meta?.description || 'Professional pavilion stands design and build services'} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        {data.hero && (
          <section 
            className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {data.hero.title}
              </h1>
              <p className="text-xl md:text-2xl">
                {data.hero.subtitle}
              </p>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {data.benefits && (
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    {data.benefits.title}
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.benefits.content || '' }}
                  />
                </div>
                {data.benefits.image && (
                  <div>
                    <img 
                      src={data.benefits.image} 
                      alt="Benefits"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Stand Project Text Section */}
        {data.standProjectText && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-2">
                {data.standProjectText.title}
              </h2>
              <h3 className="text-2xl font-semibold text-primary mb-8">
                {data.standProjectText.highlight}
              </h3>
              <div 
                className="prose prose-lg max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: data.standProjectText.description || '' }}
              />
            </div>
          </section>
        )}

        {/* Advantages Section */}
        {data.advantages && (
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {data.advantages.image && (
                  <div>
                    <img 
                      src={data.advantages.image} 
                      alt="Advantages"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {data.advantages.title}
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.advantages.content || '' }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Our Expertise Section */}
        {data.ourExpertise && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {data.ourExpertise.title}
              </h2>
              <div 
                className="prose prose-lg max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: data.ourExpertise.content || '' }}
              />
            </div>
          </section>
        )}

        {/* Company Info Section */}
        {data.companyInfo && (
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {data.companyInfo.title}
              </h2>
              <div 
                className="prose prose-lg max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: data.companyInfo.content || '' }}
              />
            </div>
          </section>
        )}
      </div>
    </>
  )
}
