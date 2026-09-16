import { Helmet } from "react-helmet-async";
import { META } from "../../data/meta.js";
import { SITE_CONFIG } from "../../config/site.js";

export default function SeoHead({ subject, unit }) {
  const subjectMeta = META[subject];
  const unitMeta = subjectMeta?.units[unit];

  const title = unitMeta
    ? `Unit ${unit}: ${unitMeta.title} — GTU ${subjectMeta.name} Question Bank`
    : `${SITE_CONFIG.name} — Previous Year Exam Papers`;

  const description = unitMeta
    ? `GTU ${subjectMeta.name} Unit ${unit}: ${unitMeta.title}. ${unitMeta.desc}. Find previous year exam questions with marks and season filters.`
    : SITE_CONFIG.description;

  const keywords = `GTU mathematics, GTU question bank, GTU previous year papers, ${subjectMeta?.name ?? "engineering mathematics"}, ${unitMeta?.title ?? ""}, GTU exam questions, Gujarat Technological University`;

  const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");
  const ogImageUrl = `${baseUrl}${SITE_CONFIG.ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_CONFIG.author} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${baseUrl}/`} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_CONFIG.name,
          url: `${baseUrl}/`,
          description: SITE_CONFIG.description,
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        })}
      </script>
    </Helmet>
  );
}
