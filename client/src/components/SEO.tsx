import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  children?: React.ReactNode;
}

const SEO = ({
  title,
  description,
  keywords,
  url,
  image,
  children,
}: SEOProps) => {
  const siteName = "Rajnish Kumar";
  const baseUrl = "https://rajnish-kumar-portfolio.vercel.app/";

  const defaultTitle = "Rajnish Kumar | Full Stack & AI Developer";
  const defaultDescription =
    "Full Stack & AI Developer specializing in React, Next.js, Node.js, Machine Learning, and Deep Learning.";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || "/default-og.png";
  const canonicalUrl = url || baseUrl;

  return (
    <>
      <Helmet>
        {/* Title */}
        <title>{finalTitle}</title>

        {/* Basic SEO */}
        <meta name="description" content={finalDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content={siteName} />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={finalImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalTitle} />
        <meta name="twitter:description" content={finalDescription} />
        <meta name="twitter:image" content={finalImage} />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Rajnish Kumar",
            url: baseUrl,
            jobTitle: "Full Stack & AI Developer",
            sameAs: [
              "https://github.com/rajnish018",
              "https://linkedin.com/in/yourprofile"
            ]
          })}
        </script>
      </Helmet>

      {children}
    </>
  );
};

export default SEO;