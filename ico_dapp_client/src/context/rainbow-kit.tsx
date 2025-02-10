'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'

import { config } from '@/lib/rainbowkit-config'

const queryClient = new QueryClient()
type Props = {
    children: React.ReactNode;
    cookie?: string | null;
};

export function RainbowKit({ children, cookie }: Props) {
    const initialState = cookieToInitialState(config, cookie);
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider showRecentTransactions={true} >{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
