import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from 'next-themes'
import { RainbowKit } from '@/context/rainbow-kit'
import '@rainbow-me/rainbowkit/styles.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { Inter, EB_Garamond } from 'next/font/google'
import { headers } from "next/headers";
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const eb_garamond = EB_Garamond({
    subsets: ['latin'],
    variable: '--font-heading'
})

export default async function LocaleLayout({ children, params }: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound()
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages()

    const cookie = headers().get("cookie");

    return (
        <html lang={locale} className={cn(inter.variable, eb_garamond.variable)}>
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-brand-50 text-brand-950 antialiased">
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <RainbowKit cookie={cookie}>
                    <main className="relative flex-1 flex flex-col">
                        <Navbar />
                        {children}
                        <Footer/>
                    </main>
                </RainbowKit>
            </ThemeProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    )
}
