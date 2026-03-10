import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import SeoHead from '@/components/SeoHead';
import { TAUX_PAYS_DATA } from '@/lib/seoData';
import { useState, useEffect } from 'react';
import { convertCurrency } from '@/services/api';

interface TauxPageProps {
    country: string;
    data: typeof TAUX_PAYS_DATA[string];
}

const MAJOR_CURRENCIES = [
    { code: 'USD', name: 'Dollar américain', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'Livre sterling', flag: '🇬🇧' },
    { code: 'CNY', name: 'Yuan chinois', flag: '🇨🇳' },
    { code: 'CHF', name: 'Franc suisse', flag: '🇨🇭' },
    { code: 'CAD', name: 'Dollar canadien', flag: '🇨🇦' },
];

export default function TauxPage({ country, data }: TauxPageProps) {
    const [rates, setRates] = useState<Record<string, number | null>>({});
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            const results: Record<string, number | null> = {};
            await Promise.all(
                data.mainPairs.map(async (from) => {
                    try {
                        const res = await convertCurrency({ from, to: data.currencyCode, amount: 1 });
                        results[from] = res.rate;
                    } catch {
                        results[from] = null;
                    }
                })
            );
            setRates(results);
            setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
            setLoading(false);
        };
        fetchRates();
    }, [data.currencyCode, data.mainPairs]);

    const title = `Taux de change au ${data.name} aujourd'hui | ${data.currencyCode} — XChange`;
    const description = `Consultez tous les taux de change officiels au ${data.name} en temps réel. ${data.description} Mis à jour toutes les 10 minutes.`;
    const canonicalPath = `/taux/${country}`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://xchange.africa' },
            { '@type': 'ListItem', position: 2, name: 'Taux par pays', item: 'https://xchange.africa/taux' },
            { '@type': 'ListItem', position: 3, name: data.name, item: `https://xchange.africa${canonicalPath}` },
        ],
    };

    const financialServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'FinancialService',
        name: `XChange — Taux de change au ${data.name}`,
        description: description,
        url: `https://xchange.africa${canonicalPath}`,
        areaServed: {
            '@type': 'Country',
            name: data.name,
        },
        currenciesAccepted: data.mainPairs.join(', '),
    };

    return (
        <>
            <SeoHead
                title={title}
                description={description}
                canonicalPath={canonicalPath}
                jsonLd={[breadcrumbSchema, financialServiceSchema]}
            />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px]" />
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full filter blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <nav className="text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li className="text-slate-600">/</li>
                            <li><Link href="/rates" className="hover:text-white transition-colors">Taux</Link></li>
                            <li className="text-slate-600">/</li>
                            <li className="text-blue-400">{data.name}</li>
                        </ol>
                    </nav>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl">{data.flag}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Taux de change au {data.name}
                    </h1>
                    <p className="text-xl text-blue-300 font-semibold mb-2">
                        Devise locale : {data.currencyName} ({data.currencyCode})
                    </p>
                    <p className="text-slate-400 max-w-2xl mb-6">{data.description}</p>

                    {lastUpdate && (
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 text-sm">
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                            </span>
                            <span>Mis à jour à {lastUpdate}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Rates table */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-8 text-slate-900">
                        Taux de change du jour au {data.name}
                    </h2>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="px-6 py-4 font-semibold">Devise</th>
                                    <th className="px-6 py-4 font-semibold">Code</th>
                                    <th className="px-6 py-4 font-semibold">1 unité → {data.currencyCode}</th>
                                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Variation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MAJOR_CURRENCIES.filter((c) => data.mainPairs.includes(c.code)).map((currency, i) => (
                                    <tr
                                        key={currency.code}
                                        className={`border-t border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{currency.flag}</span>
                                                <span className="font-medium text-slate-700">{currency.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                {currency.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-blue-700 text-lg">
                                            {loading
                                                ? <span className="inline-block w-24 h-5 bg-slate-200 rounded animate-pulse" />
                                                : rates[currency.code] != null
                                                    ? `${rates[currency.code]!.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${data.currencyCode}`
                                                    : '—'}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-slate-400 text-sm">Taux en direct</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 mt-3 text-center">
                        * Taux indicatifs. Données mises à jour toutes les 10 minutes via XChange API.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">
                        Besoin de convertir au meilleur taux ?
                    </h2>
                    <p className="text-blue-100 mb-8">
                        Utilisez notre convertisseur temps réel pour des calculs précis et configurez des alertes quand le taux atteint votre cible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5 transform"
                        >
                            Convertir maintenant
                        </Link>
                        <Link
                            href="/alerts"
                            className="border-2 border-white/50 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Créer une alerte taux
                        </Link>
                    </div>
                </div>
            </section>

            {/* Other countries */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-lg font-bold mb-4 text-slate-700">Taux dans d'autres pays</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(TAUX_PAYS_DATA)
                            .filter(([slug]) => slug !== country)
                            .slice(0, 8)
                            .map(([slug, countryData]) => (
                                <Link
                                    key={slug}
                                    href={`/taux/${slug}`}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all text-sm"
                                >
                                    <span>{countryData.flag}</span>
                                    <span>{countryData.name}</span>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = Object.keys(TAUX_PAYS_DATA).map((country) => ({
        params: { country },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const country = params?.country as string;
    const data = TAUX_PAYS_DATA[country];
    if (!data) return { notFound: true };
    return { props: { country, data } };
};
