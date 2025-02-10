import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'
import { http, createStorage, cookieStorage } from 'wagmi'

export const config = getDefaultConfig({
    appName: 'wallet-connect',
    projectId: '3d248077028e451da840e0ffc5da65b3' as string,
    chains: [
        // mainnet,
        sepolia
    ],
    storage: createStorage({
        storage: cookieStorage
    }),
    transports: {
        // [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_URL),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL)
    },
    ssr: true
})
