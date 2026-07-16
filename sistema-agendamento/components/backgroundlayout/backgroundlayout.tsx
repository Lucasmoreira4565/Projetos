import Image from "next/image";
import { ReactNode } from "react";

interface BackgroundLayoutProps {
    children: ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
    return (
       
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden p-4 sm:p-8">

            <Image
                src="/fundo-barbearia.jpg" 
                alt="Fundo da barbearia Moreira's Barber"
                fill
                quality={75}
                priority
                className="object-cover object-center z-0"
            />

            <div className="absolute inset-0 bg-black/75 z-10 backdrop-blur-[1px]"></div>

            <main className="relative flex w-full max-w-4xl flex-col items-center justify-center text-center z-20 transition-all duration-500">
                {children}
            </main>
        </div>
    );
}