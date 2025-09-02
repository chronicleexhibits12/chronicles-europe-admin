import { usePavilionStandsContent } from '@/hooks/usePavilionStandsContent'
import { Helmet } from 'react-helmet-async'

export function PavilionStands() {
  const { data, loading, error } = usePavilionStandsContent()

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
                    dangerouslySetInnerHTML={{ __html: data.benefits.content }}
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

        {/* Points Table Section */}
        {data.pointsTable && (
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                {data.pointsTable.title}
              </h2>
              <div 
                className="prose prose-lg max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: data.pointsTable.content }}
              />
            </div>
          </section>
        )}

        {/* Stand Project Text Section */}
        {data.StandProjectText && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-2">
                {data.StandProjectText.title}
              </h2>
              <h3 className="text-2xl font-semibold text-primary mb-8">
                {data.StandProjectText.highlight}
              </h3>
              <div 
                className="prose prose-lg max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: data.StandProjectText.description }}
              />
            </div>
          </section>
        )}

        {/* Exhibition Benefits Section */}
        {data.exhibitionBenefits && (
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {data.exhibitionBenefits.image && (
                  <div>
                    <img
                      src={data.exhibitionBenefits.image}
                      alt="Exhibition Benefits"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {data.exhibitionBenefits.title}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    {data.exhibitionBenefits.subtitle}
                  </p>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.exhibitionBenefits.content }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Booth Partner Section */}
        {data.boothPartner && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-2">
                {data.boothPartner.title}
              </h2>
              <h3 className="text-2xl font-semibold text-primary mb-8">
                {data.boothPartner.subtitle}
              </h3>
              <p className="text-lg text-muted-foreground">
                {data.boothPartner.description}
              </p>
            </div>
          </section>
        )}

        {/* Bold Statement Section */}
        {data.boldStatement && (
          <section className="py-16 px-4 bg-primary text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-2">
                {data.boldStatement.title}
              </h2>
              <h3 className="text-2xl font-semibold mb-8">
                {data.boldStatement.subtitle}
              </h3>
              <p className="text-lg">
                {data.boldStatement.description}
              </p>
            </div>
          </section>
        )}
      </div>
    </>
  )
}