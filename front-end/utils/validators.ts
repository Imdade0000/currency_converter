export const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const isValidAmount = (amount: any): boolean => {
    const n = parseFloat(amount);
    return !isNaN(n) && n > 0;
};
