import Image from "next/image";
import { ReactNode } from "react";

interface BackgroundLayoutProps {
    children: ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
    return (
        // Container Principal: Controla a centralização matemática de tudo na tela
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden p-4 sm:p-8">

            {/* Camada 1: A Imagem esticada de fundo */}
            <Image
                src="/fundo-barbearia.jpg" // 👈 Garanta que sua imagem está com este nome na pasta /public
                alt="Fundo da barbearia Moreira's Barber"
                fill
                quality={85}
                priority
                className="object-cover object-center z-0"
            />

            {/* Camada 2: O Overlay Preto Semitransparente (Efeito escuro) */}
            {/* bg-black/75 dá os 75% de opacidade que você pediu, sem ser degradê */}
            <div className="absolute inset-0 bg-black/75 z-10 backdrop-blur-[1px]"></div>

            {/* Camada 3: O conteúdo real do site (Card, Calendário, etc.) */}
            {/* O z-20 garante que ele flutue por cima da escuridão e os botões fiquem clicáveis */}
            <main className="relative flex w-full max-w-4xl flex-col items-center justify-center text-center z-20 transition-all duration-500">
                {children}
            </main>
        </div>
    );
}