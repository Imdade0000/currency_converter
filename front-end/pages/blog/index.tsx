import { GetStaticProps } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import SeoHead from '@/components/SeoHead';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    category: string;
    readTime: string;
    emoji: string;
}

interface BlogIndexProps {
    posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
    return (
        <>
            <SeoHead
                title="Blog XChange | Actualités taux de change & guide Afrique"
                description="Analyses des taux de change en Afrique de l'Ouest, guides pratiques de transfert d'argent, comprendre le franc CFA, le naira, le cedi et les devises africaines."
                canonicalPath="/blog"
            />

            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px]" />
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full filter blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                        📰 Blog & Ressources
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Comprendre les taux de change en Afrique
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Analyses, guides pratiques et actualités sur les devises africaines (XOF, NGN, GHS, MAD) pour mieux gérer vos transferts d'argent.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    {posts.length === 0 ? (
                        <p className="text-center text-slate-500 py-16">Aucun article disponible pour le moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {posts.map((post) => (
                                <article key={post.slug} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-40 flex items-center justify-center text-6xl">
                                        {post.emoji}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-slate-400">{post.readTime}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                                        <div className="flex items-center justify-between">
                                            <time className="text-xs text-slate-400" dateTime={post.date}>
                                                {new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </time>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="text-blue-600 font-semibold text-sm hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                                            >
                                                Lire l'article <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Topic navigator */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-lg font-bold mb-6 text-slate-700">Conversions populaires</h2>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: 'Dollar → Franc CFA', href: '/convertir/dollar-en-franc-cfa' },
                            { label: 'Euro → Franc CFA', href: '/convertir/euro-en-franc-cfa' },
                            { label: 'Euro → Naira', href: '/convertir/euro-en-naira' },
                            { label: 'Dollar → Naira', href: '/convertir/dollar-en-naira' },
                            { label: 'Taux au Bénin', href: '/taux/benin' },
                            { label: 'Taux au Sénégal', href: '/taux/senegal' },
                            { label: 'Taux au Nigeria', href: '/taux/nigeria' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all text-sm font-medium shadow-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    let posts: BlogPost[] = [];

    try {
        if (fs.existsSync(blogDir)) {
            const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
            posts = files
                .map((filename) => {
                    const slug = filename.replace(/\.(mdx|md)$/, '');
                    const filePath = path.join(blogDir, filename);
                    const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
                    return {
                        slug,
                        title: data.title || slug,
                        date: data.date || new Date().toISOString(),
                        excerpt: data.excerpt || '',
                        category: data.category || 'Guide',
                        readTime: data.readTime || '5 min',
                        emoji: data.emoji || '📊',
                    };
                })
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    } catch (_) { }

    return { props: { posts } };
};
