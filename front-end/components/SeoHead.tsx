import Head from 'next/head';

interface SeoHeadProps {
    title: string;
    description: string;
    canonicalPath?: string;
    ogImage?: string;
    jsonLd?: object | object[];
    noIndex?: boolean;
}

const BASE_URL = 'https://xchange.africa';

export default function SeoHead({
    title,
    description,
    canonicalPath = '',
    ogImage = '/og-image.png',
    jsonLd,
    noIndex = false,
}: SeoHeadProps) {
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;
    const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

    const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'XChange',
        description: 'Convertisseur de devises temps réel pour l\'Afrique',
        url: BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/convertir/{search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <Head>
            {/* Base */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:site_name" content="XChange" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImageUrl} />

            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
