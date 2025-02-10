'use client'
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <>
            <Button
                variant="link"
                size="icon"
                onClick={toggleTheme}
            >
                {theme === 'dark' ? <Sun size={28} /> : <Moon size={28} />}
            </Button>
        </>
    )
}
