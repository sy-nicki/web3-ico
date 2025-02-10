"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from 'next-intl'
import { useRouter,usePathname, useSearchParams } from 'next/navigation'
export const LanguageDropdownMenu = () => {
    const { push } = useRouter()
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1];
    const [language, setLanguage] = React.useState(currentLocale)
    const t = useTranslations('LanguageDropdownMenu')
    const searchParams = useSearchParams();
    const handleLanguageChange = (newLang: string) => {
        setLanguage(newLang)
        const basePath = pathname.replace(`/${currentLocale}`, '');
        const newPath = `/${newLang}${basePath}`;
        const params = new URLSearchParams(searchParams);
        push(`${newPath}?${params.toString()}`);

    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{t('button')}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-[24px]">
                <DropdownMenuLabel>{t('dropdownMenuLabel')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                    <DropdownMenuRadioItem value="zh">{t('zh')}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">{t('en')}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
