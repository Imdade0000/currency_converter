import { GetServerSideProps } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://xchange.africa';

const STATIC_PAGES = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/rates', priority: '0.9', changefreq: 'daily' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/faq', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.5', changefreq: 'monthly' },
];

const CONVERSION_PAIRS = [
    'dollar-en-franc-cfa',
    'euro-en-franc-cfa',
    'euro-en-naira',
    'dollar-en-naira',
    'dollar-en-franc-cfa-cameroun',
    'euro-en-dirham',
    'livre-en-franc-cfa',
    'yuan-en-franc-cfa',
    'dollar-en-cedi',
    'euro-en-cedi',
    'dollar-en-shilling-kenyan',
    'euro-en-shilling-kenyan',
    'dollar-en-birr',
    'franc-suisse-en-franc-cfa',
    'dollar-canadien-en-franc-cfa',
];

const TAUX_PAYS = [
    'benin',
    'senegal',
    'cote-divoire',
    'togo',
    'mali',
    'burkina-faso',
    'niger',
    'cameroun',
    'nigeria',
    'ghana',
    'kenya',
    'maroc',
];

function generateSitemap(blogSlugs: string[]): string {
    const today = new Date().toISOString().split('T')[0];

    const staticUrls = STATIC_PAGES.map(
        (p) => `
  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ).join('');

    const conversionUrls = CONVERSION_PAIRS.map(
        (pair) => `
  <url>
    <loc>${BASE_URL}/convertir/${pair}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
    ).join('');

    const tauxUrls = TAUX_PAYS.map(
        (pays) => `
  <url>
    <loc>${BASE_URL}/taux/${pays}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    ).join('');

    const blogUrls = blogSlugs.map(
        (slug) => `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${staticUrls}
  ${conversionUrls}
  ${tauxUrls}
  ${blogUrls}
</urlset>`;
}

function SitemapPage() {
    return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // Read blog slugs dynamically
    let blogSlugs: string[] = [];
    try {
        const blogDir = path.join(process.cwd(), 'content', 'blog');
        if (fs.existsSync(blogDir)) {
            blogSlugs = fs
                .readdirSync(blogDir)
                .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
                .map((f) => f.replace(/\.(mdx|md)$/, ''));
        }
    } catch (_) { }

    const sitemap = generateSitemap(blogSlugs);

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return { props: {} };
};

export default SitemapPage;
