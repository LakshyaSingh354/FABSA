import React from 'react'
import { AuthProvider } from './context/auth-context';


import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
            <Component {...pageProps} />
    );
}