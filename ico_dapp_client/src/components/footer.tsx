import { FaTwitter, FaTelegramPlane } from 'react-icons/fa'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import Link from 'next/link'
export const Footer = () => {
    const x= 'https://x.com/nicki_369'
    const tg = 'https://t.me/sy_nicki'
    return (
        <div className="fixed bottom-0 w-full h-[60px] mb-[60px] md:mb-[40px]">
            <MaxWidthWrapper>
                <div className="flex justify-center md:justify-end">
                    <div className="flex space-x-8 md:space-x-0 md:space-y-4 md:flex-col">
                        <Link href={x} target="_blank">
                            <FaTwitter size={28} />
                        </Link>
                        <Link href={tg} target="_blank">
                            <FaTelegramPlane size={28} />
                        </Link>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    )
}
