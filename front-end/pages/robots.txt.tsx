import { GetServerSideProps } from 'next';

const BASE_URL = 'https://xchange.africa';

function RobotsTxt() {
    return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const content = `User-agent: *
Allow: /

# Block admin & API routes from indexing
Disallow: /admin
Disallow: /api/
Disallow: /dashboard
Disallow: /notifications
Disallow: /reset-password

Sitemap: ${BASE_URL}/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
    res.write(content);
    res.end();

    return { props: {} };
};

export default RobotsTxt;
