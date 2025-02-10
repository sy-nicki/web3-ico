'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { WalletButton } from '@/components/wallet-button'
import { LanguageDropdownMenu } from '@/components/language-dropdown-menu'
import { useTranslations } from 'next-intl'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'



export const Navbar = () => {
    const t = useTranslations('Navbar')
    const pathname = usePathname()
    const currentLocale = pathname.split('/')[1];
    const navigation = [
        { name: t('home'), link: '/' },
        { name: t('staking'), link: '/staking' },
        { name: t('crypto'), link: '/crypto' },
        { name: t('contact'), link: '/contact' }
    ]
    return (
        <>
            <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full backdrop-blur-lg transition-all">
                <MaxWidthWrapper>
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className={buttonVariants({ variant: 'ghost' , className: 'text-[28px] font-bold mr-[18px]'})}>
                                ICO
                            </Link>
                            {/* Menu Items*/}
                            <div className="hidden md:flex items-center h-full space-x-10">
                                {navigation.map((el, i) => (
                                    // query: `${el.link}`
                                    <Link key={i + 1} href={{ pathname: `/${currentLocale}${el.link}` }} className={buttonVariants({
                                        variant: 'ghost',
                                        className: `${pathname === el.link ? '' : ''}`
                                    })}>
                                        {el.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <WalletButton/>
                            <LanguageDropdownMenu/>
                            <ThemeSwitcher/>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </nav>
            {/* Mobile Terminal */}
            <DropdownMenuSeparator/>
            <footer
                className="md:hidden flex items-center justify-around fixed bottom-0 px-[40px] py-[20px] w-full
                border-t border-gray-300">
                {navigation.map((el, i) => (
                    // query: `${el.link}`
                    <Link key={i + 1} href={{ pathname: `${el.link}` }} className={buttonVariants({
                        variant: 'link',
                        className: `${pathname === el.link ? '' : ''}`
                    })}>
                        <div>
                            {el.name}
                        </div>
                    </Link>
                ))}
            </footer>

        </>
    )
}
