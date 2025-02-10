"use client"
import Link from 'next/link';
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation';

interface SidebarProps {
    currentRoute: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute }) => {
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1];
    const t = useTranslations('Sidebar')
    const routes = [
        { href: "/admin", label: t('dashboard') },
        { href: "/admin/investing", label: t('investing') },
        { href: "/admin/staking", label: t('staking') },
        { href: "/admin/transfer", label: t('transfer') },
        { href: "/admin/pool", label: t('pool') },
        { href: "/admin/ico-token", label:  t('icoToken')},
    ];

    return (
        <aside>
            <nav className="flex flex-col space-y-6">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={`/${currentLocale}${route.href}`}
                        className="text-[20px] font-bold flex justify-start"
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};


