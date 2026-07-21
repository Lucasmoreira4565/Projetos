"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/lib/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        console.log("Tentando logar com:", email, password);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md w-80">
               
               <input
                    type="email"
                    placeholder= "Digite o seu E-mail"
                    value= {email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    />
                <input
                    type="password"
                    placeholder="Digite a sua senha"
                    value= {password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    />
                <button
                    type="submit"
                    disabled={carregando}
                    className="bg-green-600 text-white p-2 rounded disabled:opacity-50"
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
                </form>   
        </div>
    )
}
