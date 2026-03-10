import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import SeoHead from '@/components/SeoHead';
import React from 'react';

interface BlogPostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    category: string;
    readTime: string;
    emoji: string;
    author: string;
    relatedPairs?: string[];
}

interface BlogPostPageProps {
    slug: string;
    frontmatter: BlogPostFrontmatter;
    mdxSource: MDXRemoteSerializeResult;
    relatedPosts: { slug: string; title: string; emoji: string; category: string }[];
}

// Custom MDX components — using ComponentPropsWithoutRef to avoid TypeScript conflicts
const mdxComponents = {
    h2: (props: React.ComponentPropsWithoutRef<'h2'>) => (
        <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900" {...props} />
    ),
    h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
        <h3 className="text-xl font-bold mt-8 mb-3 text-slate-800" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<'p'>) => (
        <p className="text-slate-600 leading-relaxed mb-5" {...props} />
    ),
    ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
        <ul className="list-disc list-inside space-y-2 mb-5 text-slate-600 ml-4" {...props} />
    ),
    ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
        <ol className="list-decimal list-inside space-y-2 mb-5 text-slate-600 ml-4" {...props} />
    ),
    li: (props: React.ComponentPropsWithoutRef<'li'>) => (
        <li className="leading-relaxed" {...props} />
    ),
    strong: (props: React.ComponentPropsWithoutRef<'strong'>) => (
        <strong className="font-bold text-slate-900" {...props} />
    ),
    blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote className="border-l-4 border-blue-500 bg-blue-50 px-6 py-4 rounded-r-xl my-6 text-slate-700 italic" {...props} />
    ),
    table: (props: React.ComponentPropsWithoutRef<'table'>) => (
        <div className="overflow-x-auto my-6 rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm" {...props} />
        </div>
    ),
    th: (props: React.ComponentPropsWithoutRef<'th'>) => (
        <th className="px-4 py-3 bg-slate-900 text-white font-semibold" {...props} />
    ),
    td: (props: React.ComponentPropsWithoutRef<'td'>) => (
        <td className="px-4 py-3 border-t border-slate-100" {...props} />
    ),
    a: (props: React.ComponentPropsWithoutRef<'a'>) => (
        <a className="text-blue-600 font-medium hover:text-blue-800 underline underline-offset-2" {...props} />
    ),
};

export default function BlogPostPage({ slug, frontmatter, mdxSource, relatedPosts }: BlogPostPageProps) {
    const canonicalPath = `/blog/${slug}`;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.excerpt,
        author: {
            '@type': 'Organization',
            name: frontmatter.author || 'XChange',
        },
        publisher: {
            '@type': 'Organization',
            name: 'XChange',
            url: 'https://xchange.africa',
        },
        datePublished: frontmatter.date,
        url: `https://xchange.africa${canonicalPath}`,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://xchange.africa' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xchange.africa/blog' },
            { '@type': 'ListItem', position: 3, name: frontmatter.title, item: `https://xchange.africa${canonicalPath}` },
        ],
    };

    return (
        <>
            <SeoHead
                title={`${frontmatter.title} | Blog XChange`}
                description={frontmatter.excerpt}
                canonicalPath={canonicalPath}
                jsonLd={[articleSchema, breadcrumbSchema]}
            />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <nav className="text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li className="text-slate-600">/</li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li className="text-slate-600">/</li>
                            <li className="text-blue-400 truncate max-w-xs">{frontmatter.title}</li>
                        </ol>
                    </nav>

                    <div className="text-5xl mb-6">{frontmatter.emoji}</div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
                            {frontmatter.category}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-sm">{frontmatter.readTime} de lecture</span>
                        <span className="text-slate-500">•</span>
                        <time className="text-slate-400 text-sm" dateTime={frontmatter.date}>
                            {new Date(frontmatter.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-snug">{frontmatter.title}</h1>
                </div>
            </section>

            {/* Article body */}
            <div className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Excerpt */}
                        <p className="text-lg text-slate-500 leading-relaxed mb-10 pb-10 border-b border-slate-100 italic">
                            {frontmatter.excerpt}
                        </p>

                        {/* MDX Content */}
                        <article className="prose prose-lg max-w-none">
                            <MDXRemote {...mdxSource} components={mdxComponents} />
                        </article>

                        {/* Inline CTA */}
                        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">💱</span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        Convertir une devise maintenant
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Utilisez notre convertisseur temps réel pour un calcul précis avec le taux du moment.
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm shadow-md"
                                    >
                                        Convertir gratuitement →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
                <section className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-xl font-bold mb-6 text-slate-900">Articles liés</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {relatedPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                                >
                                    <span className="text-3xl">{post.emoji}</span>
                                    <div>
                                        <span className="text-xs text-blue-600 font-semibold">{post.category}</span>
                                        <p className="text-slate-800 font-medium text-sm leading-snug">{post.title}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/blog" className="text-blue-600 font-semibold hover:text-blue-800">
                                ← Tous les articles
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    let paths: { params: { slug: string } }[] = [];

    try {
        if (fs.existsSync(blogDir)) {
            const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
            paths = files.map((f) => ({ params: { slug: f.replace(/\.(mdx|md)$/, '') } }));
        }
    } catch (_) { }

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    const blogDir = path.join(process.cwd(), 'content', 'blog');

    // Try .mdx first, then .md
    let filePath = path.join(blogDir, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) filePath = path.join(blogDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) return { notFound: true };

    const source = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(source);
    const mdxSource = await serialize(content);

    // Get related posts
    let relatedPosts: { slug: string; title: string; emoji: string; category: string }[] = [];
    try {
        const files = fs.readdirSync(blogDir).filter((f) => (f.endsWith('.mdx') || f.endsWith('.md')) && !f.startsWith(slug));
        relatedPosts = files.slice(0, 3).map((f) => {
            const { data: d } = matter(fs.readFileSync(path.join(blogDir, f), 'utf-8'));
            return { slug: f.replace(/\.(mdx|md)$/, ''), title: d.title || '', emoji: d.emoji || '📊', category: d.category || 'Guide' };
        });
    } catch (_) { }

    return {
        props: {
            slug,
            frontmatter: {
                title: data.title || slug,
                date: data.date || new Date().toISOString(),
                excerpt: data.excerpt || '',
                category: data.category || 'Guide',
                readTime: data.readTime || '5 min',
                emoji: data.emoji || '📊',
                author: data.author || 'XChange',
            },
            mdxSource,
            relatedPosts,
        },
    };
};
