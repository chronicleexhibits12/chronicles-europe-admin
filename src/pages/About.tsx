import { useAboutPage } from '@/hooks/useAboutContent'
import { useEffect } from 'react'

export function About() {
  const { data: aboutPage, loading, error } = useAboutPage()

  // Update document title and meta tags
  useEffect(() => {
    if (aboutPage?.meta?.title) {
      document.title = aboutPage.meta.title
    }

    // Update meta description
    if (aboutPage?.meta?.description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', aboutPage.meta.description)
    }

    // Update meta keywords
    if (aboutPage?.meta?.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', aboutPage.meta.keywords)
    }
  }, [aboutPage])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !aboutPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-600">
            {error || 'About page content is not available at the moment.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {aboutPage.hero && (
        <section
          className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center bg-gray-900"
          style={{
            backgroundImage: aboutPage.hero.backgroundImage
              ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${aboutPage.hero.backgroundImage})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {aboutPage.hero.title || 'About Us'}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* Company Info Section */}
      {aboutPage.companyInfo && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Years in Business */}
              <div className="text-center lg:text-left">
                <div className="inline-block">
                  <div className="text-6xl md:text-7xl font-bold text-blue-600 mb-2">
                    {aboutPage.companyInfo.yearsInBusiness || '25+'}
                  </div>
                  <div className="text-xl font-semibold text-gray-600 tracking-wider">
                    {aboutPage.companyInfo.yearsLabel || 'YEARS'}
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div>
                {aboutPage.companyInfo.whoWeAreTitle && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {aboutPage.companyInfo.whoWeAreTitle}
                  </h2>
                )}

                {aboutPage.companyInfo.description && (
                  <div
                    className="text-gray-600 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: aboutPage.companyInfo.description }}
                  />
                )}

                {/* Company Quotes */}
                {aboutPage.companyInfo.quotes && aboutPage.companyInfo.quotes.length > 0 && (
                  <div className="space-y-4">
                    {aboutPage.companyInfo.quotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-blue-600 pl-4 italic text-gray-700">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Facts & Stats Section */}
      {(aboutPage.factsSection || aboutPage.companyStats) && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {/* Facts Header */}
            {aboutPage.factsSection && (
              <div className="text-center mb-12">
                {aboutPage.factsSection.title && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {aboutPage.factsSection.title}
                  </h2>
                )}
                {aboutPage.factsSection.description && (
                  <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {aboutPage.factsSection.description}
                  </p>
                )}
              </div>
            )}

            {/* Company Stats */}
            {aboutPage.companyStats && aboutPage.companyStats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {aboutPage.companyStats
                  .sort((a, b) => a.order - b.order)
                  .map((stat) => (
                    <div key={stat.id} className="text-center">
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {stat.value.toLocaleString()}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {stat.description}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Team Section */}
      {aboutPage.teamInfo && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {aboutPage.teamInfo.title && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {aboutPage.teamInfo.title}
                  </h2>
                )}
                {aboutPage.teamInfo.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {aboutPage.teamInfo.description}
                  </p>
                )}
              </div>

              {aboutPage.teamInfo.teamImage && (
                <div className="lg:order-first">
                  <img
                    src={aboutPage.teamInfo.teamImage}
                    alt="Our Team"
                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {aboutPage.services && aboutPage.services.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="space-y-16">
              {aboutPage.services
                .sort((a, b) => a.order - b.order)
                .map((service) => (
                  <div key={service.id} className={`grid lg:grid-cols-2 gap-12 items-center ${service.isReversed ? 'lg:grid-flow-col-dense' : ''
                    }`}>
                    <div className={service.isReversed ? 'lg:col-start-2' : ''}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className={service.isReversed ? 'lg:col-start-1' : ''}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}