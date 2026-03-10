// Data for all conversion pairs
export const CONVERSION_PAIRS_DATA: Record<
    string,
    {
        from: string;
        fromCode: string;
        to: string;
        toCode: string;
        fromFlag: string;
        toFlag: string;
        label: string;
        description: string;
        amounts: number[];
        faqItems: { q: string; a: string }[];
        relatedPairs: string[];
    }
> = {
    'dollar-en-franc-cfa': {
        from: 'Dollar américain',
        fromCode: 'USD',
        to: 'Franc CFA (BCEAO)',
        toCode: 'XOF',
        fromFlag: '🇺🇸',
        toFlag: '🌍',
        label: 'Dollar en Franc CFA',
        description:
            'Convertissez vos dollars américains (USD) en francs CFA BCEAO (XOF) au taux officiel du jour. Mis à jour toutes les 10 minutes.',
        amounts: [1, 50, 100, 500, 1000, 5000],
        faqItems: [
            {
                q: 'Quel est le taux du dollar en franc CFA aujourd\'hui ?',
                a: 'Le taux USD/XOF fluctue quotidiennement. Utilisez notre convertisseur ci-dessus pour obtenir le taux en temps réel. En moyenne, 1 dollar vaut entre 590 et 640 francs CFA selon les fluctuations du marché.',
            },
            {
                q: 'Combien vaut 100 dollars en franc CFA ?',
                a: '100 dollars américains valent entre 59 000 et 64 000 francs CFA selon le taux du jour. Utilisez notre outil de conversion pour connaître le montant exact en ce moment.',
            },
            {
                q: 'Pourquoi le franc CFA est-il lié à l\'euro et non au dollar ?',
                a: 'Le franc CFA BCEAO (XOF) est rattaché à l\'euro depuis 1999 (auparavant au franc français). Sa valeur par rapport au dollar USD varie donc en fonction du taux EUR/USD sur les marchés internationaux.',
            },
            {
                q: 'Comment envoyer des dollars en Afrique de l\'Ouest ?',
                a: 'Pour envoyer des dollars en Afrique de l\'Ouest, vous pouvez utiliser des services comme Western Union, Wave, WorldRemit ou votre banque. Vérifiez d\'abord notre taux de référence pour savoir si le taux proposé est avantageux.',
            },
        ],
        relatedPairs: ['euro-en-franc-cfa', 'livre-en-franc-cfa', 'dollar-en-naira'],
    },
    'euro-en-franc-cfa': {
        from: 'Euro',
        fromCode: 'EUR',
        to: 'Franc CFA (BCEAO)',
        toCode: 'XOF',
        fromFlag: '🇪🇺',
        toFlag: '🌍',
        label: 'Euro en Franc CFA',
        description:
            'Convertissez vos euros (EUR) en francs CFA BCEAO (XOF). Le taux officiel EUR/XOF est fixé à 655,957 par la Banque de France.',
        amounts: [1, 50, 100, 500, 1000, 5000],
        faqItems: [
            {
                q: 'Quel est le taux fixe de l\'euro en franc CFA ?',
                a: 'Le taux officiel est de 1 EUR = 655,957 XOF, fixé par accord entre la France et les pays de l\'UEMOA. Ce taux est garanti par le Trésor français.',
            },
            {
                q: 'Combien vaut 100 euros en franc CFA ?',
                a: '100 euros valent exactement 65 595,70 francs CFA au taux officiel. Ce taux est fixe et ne varie pas comme les autres devises.',
            },
            {
                q: 'Peut-on changer des euros au Bénin facilement ?',
                a: 'Oui, les euros sont facilement échangeables au Bénin dans les banques, bureaux de change et certains hôtels. Le taux peut légèrement varier selon l\'établissement.',
            },
            {
                q: 'L\'euro va-t-il rester lié au franc CFA ?',
                a: 'Des discussions politiques sont en cours sur la réforme du franc CFA. Toutefois, à ce jour, la parité EUR/XOF reste fixée à 655,957 et aucun changement imminent n\'a été officiellement annoncé.',
            },
        ],
        relatedPairs: ['dollar-en-franc-cfa', 'livre-en-franc-cfa', 'euro-en-naira'],
    },
    'euro-en-naira': {
        from: 'Euro',
        fromCode: 'EUR',
        to: 'Naira nigérian',
        toCode: 'NGN',
        fromFlag: '🇪🇺',
        toFlag: '🇳🇬',
        label: 'Euro en Naira',
        description:
            'Convertissez vos euros (EUR) en nairas nigérians (NGN) au meilleur taux du marché. Le naira fluctue fortement, consultez notre taux en direct.',
        amounts: [1, 50, 100, 500, 1000, 5000],
        faqItems: [
            {
                q: 'Pourquoi le naira perd-il de la valeur face à l\'euro ?',
                a: 'Le naira a connu une forte dévaluation depuis 2023 suite à la décision du gouvernement nigérian de laisser flotter la monnaie. Les pressions liées à la baisse des revenus pétroliers et la fuite de capitaux ont amplifié cette dépréciation.',
            },
            {
                q: 'Combien vaut 100 euros en nairas ?',
                a: 'Le taux EUR/NGN fluctue fortement. Utilisez notre convertisseur en temps réel pour connaître la valeur exacte. À titre indicatif, 100 euros valaient entre 80 000 et 100 000 nairas en 2024.',
            },
            {
                q: 'Comment envoyer des euros au Nigeria ?',
                a: 'Pour envoyer des euros au Nigeria, des services comme Lemfi, Sendwave, Wise ou WorldRemit offrent souvent de meilleurs taux que les banques traditionnelles. Vérifiez notre taux de référence avant d\'effectuer un transfert.',
            },
            {
                q: 'Y a-t-il un taux officiel et un taux parallèle pour le naira ?',
                a: 'Depuis la flottaison du naira en 2023, le gouvernement nigérian cherche à unifier le taux de change. Cependant, un écart peut encore exister entre le taux officiel NAFEX et le marché parallèle au Nigeria.',
            },
        ],
        relatedPairs: ['dollar-en-naira', 'euro-en-franc-cfa', 'livre-en-franc-cfa'],
    },
    'dollar-en-naira': {
        from: 'Dollar américain',
        fromCode: 'USD',
        to: 'Naira nigérian',
        toCode: 'NGN',
        fromFlag: '🇺🇸',
        toFlag: '🇳🇬',
        label: 'Dollar en Naira',
        description:
            'Convertissez des dollars américains (USD) en nairas nigérians (NGN). Taux USD/NGN en temps réel, mis à jour toutes les 10 minutes.',
        amounts: [1, 50, 100, 500, 1000, 5000],
        faqItems: [
            {
                q: 'Combien vaut 1 dollar en naira aujourd\'hui ?',
                a: 'Le taux USD/NGN est très volatile. Utilisez notre convertisseur ci-dessus pour le taux exact. En 2024, 1 dollar valait entre 1 300 et 1 600 nairas selon les périodes.',
            },
            {
                q: 'Quel est le meilleur endroit pour changer des dollars en Nigeria ?',
                a: 'Les banques agréées (Access Bank, GTBank, Zenith Bank) proposent le taux officiel. Les bureaux de change (BDC) sur le marché parallèle peuvent offrir de meilleurs taux mais avec des risques. Comparez toujours avec notre taux de référence.',
            },
            {
                q: 'Comment le naira a-t-il évolué face au dollar ces dernières années ?',
                a: 'Le naira a perdu plus de 60% de sa valeur face au dollar depuis 2023. En 2020, 1 dollar valait environ 380 nairas. En 2024, ce même dollar vaut plus de 1 500 nairas, reflétant la sévère dépréciation de la monnaie nigériane.',
            },
            {
                q: 'Peut-on avoir un compte en dollars au Nigeria ?',
                a: 'Oui, plusieurs banques nigérianes proposent des comptes en devises (domiciliary accounts), permettant de conserver des dollars et d\'effectuer des transactions internationales.',
            },
        ],
        relatedPairs: ['euro-en-naira', 'dollar-en-franc-cfa', 'dollar-en-cedi'],
    },
    'dollar-en-franc-cfa-cameroun': {
        from: 'Dollar américain',
        fromCode: 'USD',
        to: 'Franc CFA (BEAC)',
        toCode: 'XAF',
        fromFlag: '🇺🇸',
        toFlag: '🇨🇲',
        label: 'Dollar en Franc CFA Cameroun (XAF)',
        description:
            'Convertissez des dollars américains (USD) en francs CFA BEAC (XAF) utilisés au Cameroun, Gabon, Congo, Tchad, RCA et Guinée Équatoriale.',
        amounts: [1, 50, 100, 500, 1000, 5000],
        faqItems: [
            {
                q: 'Quelle est la différence entre le franc CFA BCEAO (XOF) et BEAC (XAF) ?',
                a: 'Ce sont deux monnaies distinctes, bien que leur valeur soit identique (toutes deux à 1 EUR = 655,957). Le XOF est utilisé en Afrique de l\'Ouest (Bénin, Sénégal, Côte d\'Ivoire, etc.) et le XAF en Afrique Centrale (Cameroun, Gabon, etc.).',
            },
            {
                q: 'Combien vaut 100 dollars en franc CFA au Cameroun ?',
                a: 'La valeur en XAF est identique à celle en XOF puisque les deux monnaies ont la même parité avec l\'euro. Consultez notre convertisseur ci-dessus pour le taux exact du jour.',
            },
            {
                q: 'Où changer des dollars à Douala ou Yaoundé ?',
                a: 'Les principales banques (Afriland First Bank, BICEC, SCB Cameroun) et bureaux de change agréés de Douala et Yaoundé permettent d\'échanger des dollars contre des francs CFA XAF au taux officiel.',
            },
        ],
        relatedPairs: ['dollar-en-franc-cfa', 'euro-en-franc-cfa', 'dollar-en-naira'],
    },
    'livre-en-franc-cfa': {
        from: 'Livre sterling',
        fromCode: 'GBP',
        to: 'Franc CFA (BCEAO)',
        toCode: 'XOF',
        fromFlag: '🇬🇧',
        toFlag: '🌍',
        label: 'Livre Sterling en Franc CFA',
        description:
            'Convertissez des livres sterling (GBP) en francs CFA BCEAO (XOF). Obtenez le meilleur taux GBP/XOF en temps réel.',
        amounts: [1, 50, 100, 500, 1000],
        faqItems: [
            {
                q: 'Combien vaut 100 livres en franc CFA ?',
                a: 'La conversion GBP/XOF passe par EUR. 100 livres sterling valent généralement entre 75 000 et 85 000 francs CFA selon le taux EUR/GBP du moment. Consultez notre convertisseur pour le taux exact.',
            },
            {
                q: 'Y a-t-il une communauté africaine importante au Royaume-Uni ?',
                a: 'Oui, le Royaume-Uni abrite une importante diaspora d\'Afrique de l\'Ouest, notamment des Nigérians, Ghanéens, Sierra-Léonais et Sénégalais. Les transferts GBP vers l\'Afrique de l\'Ouest représentent des milliards de livres chaque année.',
            },
        ],
        relatedPairs: ['euro-en-franc-cfa', 'dollar-en-franc-cfa', 'livre-en-franc-cfa'],
    },
    'yuan-en-franc-cfa': {
        from: 'Yuan chinois',
        fromCode: 'CNY',
        to: 'Franc CFA (BCEAO)',
        toCode: 'XOF',
        fromFlag: '🇨🇳',
        toFlag: '🌍',
        label: 'Yuan Chinois en Franc CFA',
        description:
            'Convertissez des yuans chinois (CNY/RMB) en francs CFA BCEAO (XOF). La Chine étant le premier partenaire commercial de l\'Afrique, connaître ce taux est essentiel.',
        amounts: [1, 10, 50, 100, 500, 1000],
        faqItems: [
            {
                q: 'Pourquoi beaucoup d\'Africains veulent convertir des yuans en francs CFA ?',
                a: 'La Chine est le premier partenaire commercial de l\'Afrique. Des milliers de commerçants ouest-africains voyagent en Chine pour leurs achats et ont besoin de connaître le taux CNY/XOF pour calculer leurs coûts d\'importation.',
            },
            {
                q: 'Peut-on payer en yuans en Afrique de l\'Ouest ?',
                a: 'Bien que les paiements en yuan ne soient pas encore courants dans les commerces, certains ports et zones commerciales (Cotonou, Dakar) commencent à accepter le yuan. Les virements bancaires en CNY sont possibles dans plusieurs banques.',
            },
        ],
        relatedPairs: ['dollar-en-franc-cfa', 'euro-en-franc-cfa', 'dollar-en-naira'],
    },
    'euro-en-dirham': {
        from: 'Euro',
        fromCode: 'EUR',
        to: 'Dirham marocain',
        toCode: 'MAD',
        fromFlag: '🇪🇺',
        toFlag: '🇲🇦',
        label: 'Euro en Dirham Marocain',
        description:
            'Convertissez des euros (EUR) en dirhams marocains (MAD) au taux officiel Bank Al-Maghrib. Taux mis à jour quotidiennement.',
        amounts: [1, 50, 100, 500, 1000],
        faqItems: [
            {
                q: 'Quel est le taux de l\'euro en dirham aujourd\'hui ?',
                a: 'Le dirham marocain est une devise semi-fixe régulée par Bank Al-Maghrib. Le taux EUR/MAD oscille généralement entre 10,7 et 11,2 dirhams pour 1 euro. Consultez notre convertisseur pour le taux exact.',
            },
            {
                q: 'Peut-on emporter des dirhams à l\'étranger depuis le Maroc ?',
                a: 'La réglementation marocaine limite l\'exportation de dirhams. Il est recommandé de convertir vos dirhams avant de quitter le Maroc ou d\'utiliser des cartes bancaires internationales pour vos voyages.',
            },
        ],
        relatedPairs: ['dollar-en-franc-cfa', 'euro-en-franc-cfa', 'euro-en-naira'],
    },
};

export const TAUX_PAYS_DATA: Record<
    string,
    {
        name: string;
        flag: string;
        currencyCode: string;
        currencyName: string;
        description: string;
        mainPairs: string[];
    }
> = {
    benin: {
        name: 'Bénin',
        flag: '🇧🇯',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: 'Taux de change officiels au Bénin. Le Bénin utilise le franc CFA BCEAO (XOF), partagé avec 7 autres pays d\'Afrique de l\'Ouest.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY', 'CAD'],
    },
    senegal: {
        name: 'Sénégal',
        flag: '🇸🇳',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: 'Taux de change à Dakar et au Sénégal. Le Sénégal utilise le franc CFA BCEAO (XOF), l\'une des économies les plus stables d\'Afrique de l\'Ouest.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY'],
    },
    'cote-divoire': {
        name: "Côte d'Ivoire",
        flag: '🇨🇮',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: "Taux de change en Côte d'Ivoire, première économie de la zone UEMOA. Abidjan est le centre financier de l'Afrique de l'Ouest francophone.",
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY'],
    },
    togo: {
        name: 'Togo',
        flag: '🇹🇬',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: 'Taux de change officiels au Togo. Lomé est un important hub commercial entre le littoral et les pays enclavés du Sahel.',
        mainPairs: ['USD', 'EUR', 'GBP'],
    },
    mali: {
        name: 'Mali',
        flag: '🇲🇱',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: 'Taux de change au Mali. Bamako est le principal centre économique du pays.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY'],
    },
    'burkina-faso': {
        name: 'Burkina Faso',
        flag: '🇧🇫',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: 'Taux de change au Burkina Faso. Ouagadougou concentre l\'essentiel des activités commerciales et financières du pays.',
        mainPairs: ['USD', 'EUR', 'GBP'],
    },
    niger: {
        name: 'Niger',
        flag: '🇳🇪',
        currencyCode: 'XOF',
        currencyName: 'Franc CFA BCEAO',
        description: 'Taux de change au Niger. Niamey est la capitale et principale ville économique du pays.',
        mainPairs: ['USD', 'EUR'],
    },
    cameroun: {
        name: 'Cameroun',
        flag: '🇨🇲',
        currencyCode: 'XAF',
        currencyName: 'Franc CFA BEAC',
        description: 'Taux de change au Cameroun. Le Cameroun utilise le franc CFA BEAC (XAF), partagé avec 5 autres pays d\'Afrique Centrale.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY'],
    },
    nigeria: {
        name: 'Nigeria',
        flag: '🇳🇬',
        currencyCode: 'NGN',
        currencyName: 'Naira nigérian',
        description: 'Taux de change au Nigeria, première économie africaine. Le naira (NGN) est une devise flottante qui fluctue quotidiennement sur les marchés.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY'],
    },
    ghana: {
        name: 'Ghana',
        flag: '🇬🇭',
        currencyCode: 'GHS',
        currencyName: 'Cedi ghanéen',
        description: 'Taux de change au Ghana. Le cedi (GHS) est la devise officielle du Ghana, deuxième économie de l\'Afrique de l\'Ouest.',
        mainPairs: ['USD', 'EUR', 'GBP'],
    },
    kenya: {
        name: 'Kenya',
        flag: '🇰🇪',
        currencyCode: 'KES',
        currencyName: 'Shilling kenyan',
        description: 'Taux de change au Kenya, hub technologique et financier de l\'Afrique de l\'Est. Le shilling kenyan (KES) est relativement stable.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CNY'],
    },
    maroc: {
        name: 'Maroc',
        flag: '🇲🇦',
        currencyCode: 'MAD',
        currencyName: 'Dirham marocain',
        description: 'Taux de change au Maroc. Le dirham marocain (MAD) est une devise semi-fixe régulée par Bank Al-Maghrib.',
        mainPairs: ['USD', 'EUR', 'GBP', 'CHF'],
    },
};
