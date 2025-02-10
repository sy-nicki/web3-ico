import { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { MaxWidthWrapper } from '@/components/max-width-wrapper'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <MaxWidthWrapper>
                <div className="flex ml-[20px] mt-12">
                    <Sidebar />
                    {children}
                </div>
            </MaxWidthWrapper>
        </>
    )
}

export default Layout
