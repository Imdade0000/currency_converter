import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout';
import { I18nProvider } from '@/i18n/I18nProvider';
import '@/styles/globals.css';
import '@/styles/animations.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Toaster position="top-right" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nProvider>
  );
}
