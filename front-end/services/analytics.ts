// Simple analytics tracker placeholder
export const trackEvent = (eventName: string, properties?: any) => {
    if (process.env.NODE_ENV === 'production') {
        // Integrate with GTM, Mixpanel, etc.
        console.log(`[Track] ${eventName}`, properties);
    } else {
        console.log(`[Dev-Track] ${eventName}`, properties);
    }
};
