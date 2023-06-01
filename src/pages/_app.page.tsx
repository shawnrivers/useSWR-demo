import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <Head>
          <title>useSWR v2</title>
        </Head>
        <Component {...pageProps} />
        <Toaster position="bottom-left" />
      </SWRConfig>
    </>
  );
}
