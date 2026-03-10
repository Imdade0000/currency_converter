export const formatCurrency = (amount: number, currency: string, locale: string = 'fr-FR') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(amount);
};

export const formatDate = (date: string | Date, locale: string = 'fr-FR') => {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

export const truncateString = (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};
