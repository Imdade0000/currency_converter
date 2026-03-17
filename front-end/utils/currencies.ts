export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  popular?: boolean;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'Dollar Américain', symbol: '$', flag: 'us', popular: true },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu', popular: true },
  { code: 'GBP', name: 'Livre Sterling', symbol: '£', flag: 'gb', popular: true },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', flag: 'sn', popular: true },
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', flag: 'cm', popular: true },
  { code: 'NGN', name: 'Naira Nigérian', symbol: '₦', flag: 'ng', popular: true },
  { code: 'GHS', name: 'Cedi Ghanéen', symbol: '₵', flag: 'gh', popular: true },
  { code: 'JPY', name: 'Yen Japonais', symbol: '¥', flag: 'jp', popular: true },
  { code: 'CNY', name: 'Yuan Chinois', symbol: '¥', flag: 'cn', popular: true },
  { code: 'CAD', name: 'Dollar Canadien', symbol: 'C$', flag: 'ca', popular: true },
  { code: 'AUD', name: 'Dollar Australien', symbol: 'A$', flag: 'au' },
  { code: 'CHF', name: 'Franc Suisse', symbol: 'CHF', flag: 'ch' },
  { code: 'INR', name: 'Roupie Indienne', symbol: '₹', flag: 'in' },
  { code: 'BRL', name: 'Real Brésilien', symbol: 'R$', flag: 'br' },
  { code: 'ZAR', name: 'Rand Sud-Africain', symbol: 'R', flag: 'za' },
  { code: 'KES', name: 'Shilling Kenyan', symbol: 'KSh', flag: 'ke' },
  { code: 'TND', name: 'Dinar Tunisien', symbol: 'DT', flag: 'tn' },
  { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH', flag: 'ma' },
  { code: 'EGP', name: 'Livre Égyptienne', symbol: 'E£', flag: 'eg' },
  { code: 'AED', name: 'Dirham des EAU', symbol: 'AED', flag: 'ae' },
  { code: 'SAR', name: 'Riyal Saoudien', symbol: 'SR', flag: 'sa' },
  { code: 'MXN', name: 'Peso Mexicain', symbol: 'Mex$', flag: 'mx' },
  { code: 'RUB', name: 'Rouble Russe', symbol: '₽', flag: 'ru' },
  { code: 'TRY', name: 'Livre Turque', symbol: '₺', flag: 'tr' },
  { code: 'KRW', name: 'Won Sud-Coréen', symbol: '₩', flag: 'kr' },
  { code: 'SGD', name: 'Dollar de Singapour', symbol: 'S$', flag: 'sg' },
  { code: 'THB', name: 'Baht Thaïlandais', symbol: '฿', flag: 'th' },
  { code: 'PLN', name: 'Zloty Polonais', symbol: 'zł', flag: 'pl' },
  { code: 'SEK', name: 'Couronne Suédoise', symbol: 'kr', flag: 'se' },
  { code: 'NOK', name: 'Couronne Norvégienne', symbol: 'kr', flag: 'no' },
  { code: 'DKK', name: 'Couronne Danoise', symbol: 'kr', flag: 'dk' },
];

export const popularCurrencies = currencies.filter(c => c.popular);

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find(c => c.code === code);
};

export const formatAmount = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + (currency?.symbol || currencyCode);
};

export const CURRENCY_NAMES: Record<string, { fr: string, en: string }> = {
  USD: { fr: 'Dollar Américain', en: 'US Dollar' },
  EUR: { fr: 'Euro', en: 'Euro' },
  GBP: { fr: 'Livre Sterling', en: 'British Pound' },
  XOF: { fr: 'Franc CFA (BCEAO)', en: 'CFA Franc (BCEAO)' },
  XAF: { fr: 'Franc CFA (BEAC)', en: 'CFA Franc (BEAC)' },
  NGN: { fr: 'Naira Nigérian', en: 'Nigerian Naira' },
  GHS: { fr: 'Cedi Ghanéen', en: 'Ghanaian Cedi' },
  JPY: { fr: 'Yen Japonais', en: 'Japanese Yen' },
  CNY: { fr: 'Yuan Chinois', en: 'Chinese Yuan' },
  CAD: { fr: 'Dollar Canadien', en: 'Canadian Dollar' },
};

export const getCurrencyName = (code: string, isFr: boolean) => {
  const nameObj = CURRENCY_NAMES[code];
  if (!nameObj) return code;
  return `${code} - ${isFr ? nameObj.fr : nameObj.en}`;
};