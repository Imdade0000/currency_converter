export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  popular?: boolean;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'Dollar américain', symbol: '$', flag: 'us', popular: true },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu', popular: true },
  { code: 'GBP', name: 'Livre sterling', symbol: '£', flag: 'gb', popular: true },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', flag: 'sn', popular: true },
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', flag: 'cm', popular: true },
  { code: 'NGN', name: 'Naira nigérian', symbol: '₦', flag: 'ng', popular: true },
  { code: 'GHS', name: 'Cedi ghanéen', symbol: '₵', flag: 'gh', popular: true },
  { code: 'JPY', name: 'Yen japonais', symbol: '¥', flag: 'jp', popular: true },
  { code: 'CNY', name: 'Yuan chinois', symbol: '¥', flag: 'cn', popular: true },
  { code: 'CAD', name: 'Dollar canadien', symbol: 'C$', flag: 'ca', popular: true },
  { code: 'AUD', name: 'Dollar australien', symbol: 'A$', flag: 'au' },
  { code: 'CHF', name: 'Franc suisse', symbol: 'CHF', flag: 'ch' },
  { code: 'INR', name: 'Roupie indienne', symbol: '₹', flag: 'in' },
  { code: 'BRL', name: 'Real brésilien', symbol: 'R$', flag: 'br' },
  { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', flag: 'za' },
  { code: 'KES', name: 'Shilling kenyan', symbol: 'KSh', flag: 'ke' },
  { code: 'TND', name: 'Dinar tunisien', symbol: 'DT', flag: 'tn' },
  { code: 'MAD', name: 'Dirham marocain', symbol: 'DH', flag: 'ma' },
  { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£', flag: 'eg' },
  { code: 'AED', name: 'Dirham des EAU', symbol: 'AED', flag: 'ae' },
  { code: 'SAR', name: 'Riyal saoudien', symbol: 'SR', flag: 'sa' },
  { code: 'MXN', name: 'Peso mexicain', symbol: 'Mex$', flag: 'mx' },
  { code: 'RUB', name: 'Rouble russe', symbol: '₽', flag: 'ru' },
  { code: 'TRY', name: 'Livre turque', symbol: '₺', flag: 'tr' },
  { code: 'KRW', name: 'Won sud-coréen', symbol: '₩', flag: 'kr' },
  { code: 'SGD', name: 'Dollar de Singapour', symbol: 'S$', flag: 'sg' },
  { code: 'THB', name: 'Baht thaïlandais', symbol: '฿', flag: 'th' },
  { code: 'PLN', name: 'Zloty polonais', symbol: 'zł', flag: 'pl' },
  { code: 'SEK', name: 'Couronne suédoise', symbol: 'kr', flag: 'se' },
  { code: 'NOK', name: 'Couronne norvégienne', symbol: 'kr', flag: 'no' },
  { code: 'DKK', name: 'Couronne danoise', symbol: 'kr', flag: 'dk' },
];

export const popularCurrencies = currencies.filter((currency) => currency.popular);

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find((currency) => currency.code === code);
};

export const formatAmount = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + (currency?.symbol || currencyCode);
};

export const CURRENCY_NAMES: Record<string, { fr: string, en: string }> = {
  USD: { fr: 'Dollar américain', en: 'US Dollar' },
  EUR: { fr: 'Euro', en: 'Euro' },
  GBP: { fr: 'Livre sterling', en: 'British Pound' },
  XOF: { fr: 'Franc CFA (BCEAO)', en: 'CFA Franc (BCEAO)' },
  XAF: { fr: 'Franc CFA (BEAC)', en: 'CFA Franc (BEAC)' },
  NGN: { fr: 'Naira nigérian', en: 'Nigerian Naira' },
  GHS: { fr: 'Cedi ghanéen', en: 'Ghanaian Cedi' },
  JPY: { fr: 'Yen japonais', en: 'Japanese Yen' },
  CNY: { fr: 'Yuan chinois', en: 'Chinese Yuan' },
  CAD: { fr: 'Dollar canadien', en: 'Canadian Dollar' },
};

export const getCurrencyName = (code: string, isFr: boolean) => {
  const nameObj = CURRENCY_NAMES[code];
  if (!nameObj) return code;
  return `${code} - ${isFr ? nameObj.fr : nameObj.en}`;
};
