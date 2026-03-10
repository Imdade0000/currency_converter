import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SeoHead from '@/components/SeoHead';
import { CONVERSION_PAIRS_DATA } from '@/lib/seoData';
import { convertCurrency } from '@/services/api';

interface ConversionPageProps {
    pair: string;
    data: typeof CONVERSION_PAIRS_DATA[string];
}

export default function ConversionPage({ pair, data }: ConversionPageProps) {
    const [liveRate, setLiveRate] = useState<number | null>(null);
    const [loadingRate, setLoadingRate] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                setLoadingRate(true);
                const res = await convertCurrency({ from: data.fromCode, to: data.toCode, amount: 1 });
                setLiveRate(res.rate);
            } catch {
                setLiveRate(null);
            } finally {
                setLoadingRate(false);
            }
        };
        fetchRate();
    }, [data.fromCode, data.toCode]);

    const canonicalPath = `/convertir/${pair}`;

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://xchange.africa' },
            { '@type': 'ListItem', position: 2, name: 'Convertisseur', item: 'https://xchange.africa/convertir' },
            { '@type': 'ListItem', position: 3, name: data.label, item: `https://xchange.africa${canonicalPath}` },
        ],
    };

    const title = `${data.label} | Taux ${data.fromCode}/${data.toCode} du jour — XChange`;
    const description = data.description;

    return (
        <>
            <SeoHead
                title={title}
                description={description}
                canonicalPath={canonicalPath}
                jsonLd={[faqSchema, breadcrumbSchema]}
            />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px]" />
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full filter blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li className="text-slate-600">/</li>
                            <li className="text-slate-300">Convertir</li>
                            <li className="text-slate-600">/</li>
                            <li className="text-blue-400">{data.label}</li>
                        </ol>
                    </nav>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{data.fromFlag}</span>
                        <div className="w-8 h-0.5 bg-blue-400" />
                        <span className="text-5xl">{data.toFlag}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Convertir {data.from} en {data.to}
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mb-8">{data.description}</p>

                    {/* Live rate badge */}
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                        </span>
                        <span className="text-white font-semibold">
                            {loadingRate
                                ? 'Chargement du taux...'
                                : liveRate
                                    ? `1 ${data.fromCode} = ${liveRate.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} ${data.toCode}`
                                    : `Taux ${data.fromCode}/${data.toCode} en direct`}
                        </span>
                        <span className="text-slate-400 text-sm">• Mis à jour toutes les 10 min</span>
                    </div>
                </div>
            </section>

            {/* Conversion table */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 text-slate-900">
                            Tableau de conversion {data.fromCode} → {data.toCode}
                        </h2>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="px-6 py-4 font-semibold">Montant ({data.fromCode})</th>
                                        <th className="px-6 py-4 font-semibold">Équivalent ({data.toCode})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.amounts.map((amount, i) => (
                                        <tr
                                            key={amount}
                                            className={`border-t border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {amount.toLocaleString('fr-FR')} {data.fromCode}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-blue-700">
                                                {liveRate
                                                    ? (amount * liveRate).toLocaleString('fr-FR', { maximumFractionDigits: 2 })
                                                    : '—'}{' '}
                                                {data.toCode}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-sm text-slate-500 mt-3 text-center">
                            * Basé sur le taux en direct. Taux indicatif, peut différer selon le prestataire.
                        </p>

                        <div className="mt-10 text-center">
                            <Link
                                href="/"
                                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                            >
                                Utiliser le convertisseur complet →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-2xl font-bold mb-10 text-slate-900">
                        Questions fréquentes sur {data.label}
                    </h2>

                    <div className="space-y-4">
                        {data.faqItems.map((item, i) => (
                            <FaqItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Related pairs */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-900">Conversions liées</h2>
                    <div className="flex flex-wrap gap-3">
                        {data.relatedPairs.map((relatedPair) => {
                            const relatedData = CONVERSION_PAIRS_DATA[relatedPair];
                            if (!relatedData) return null;
                            return (
                                <Link
                                    key={relatedPair}
                                    href={`/convertir/${relatedPair}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all text-sm font-medium"
                                >
                                    <span>{relatedData.fromFlag}</span>
                                    <span>→</span>
                                    <span>{relatedData.toFlag}</span>
                                    <span>{relatedData.fromCode}/{relatedData.toCode}</span>
                                </Link>
                            );
                        })}
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium"
                        >
                            Toutes les devises →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="font-semibold text-slate-900">{question}</span>
                <span className={`text-blue-600 text-xl flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {answer}
                </div>
            )}
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = Object.keys(CONVERSION_PAIRS_DATA).map((pair) => ({
        params: { pair },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const pair = params?.pair as string;
    const data = CONVERSION_PAIRS_DATA[pair];
    if (!data) return { notFound: true };
    return { props: { pair, data } };
};
