// pages/_app.tsx
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';

// Import global CSS here — ONLY in _app.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'; // your own global CSS file

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}