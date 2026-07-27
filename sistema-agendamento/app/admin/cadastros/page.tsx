"use client"

import { useState,useEffect } from "react"
import { createClient } from "@/supabase/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Scissors, Users, Wrench, Trash2, Plus } from "lucide-react";

export default function CadastrosPage(){
    const router = useRouter();
    const [abaAtiva, setAbaAtiva] = useState<"profissionais" | "clientes" | "servicos">("profissionais");
    const [profissionais, setProfissionais] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const supabase = createClient();
    const [carregando, setCarregando] = useState(true);
    

    useEffect(() => {
        async function carregarDados() {
            const { data: profData } = await supabase.from("profissionais").select("*");
            if (profData) setProfissionais(profData);
            const { data: servData } = await supabase.from("servicos").select("*");
            if (servData) setServicos(servData);
            const { data: cliData } = await supabase.from("clientes").select("*");
            if (cliData) setClientes(cliData);
        }

        async function verificarAcesso() {
            const { data: { session } } = await supabase.auth.getSession();
           if (!session) {
               router.push("/admin/login");
               return;
           }
            await carregarDados();
            setCarregando(false);
        }

        verificarAcesso();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Central de Cadastros</h1>
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </button>
                </div>
                <div className="flex gap-2 border-b border-gray-200 bg-white p-2 rounded-t-lg">
                    <button
                        onClick={() => setAbaAtiva("profissionais")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${abaAtiva === "profissionais"
                                ? "bg-zinc-900 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Scissors className="w-4 h-4" />
                        Profissionais
                    </button>

                    <button
                        onClick={() => setAbaAtiva("clientes")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${abaAtiva === "clientes"
                                ? "bg-zinc-900 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Clientes
                    </button>

                    <button
                        onClick={() => setAbaAtiva("servicos")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${abaAtiva === "servicos"
                                ? "bg-zinc-900 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Wrench className="w-4 h-4" />
                        Serviços
                    </button>
                </div>
                <div className="bg-white p-6 rounded-b-lg border border-gray-200">
                    {abaAtiva === "profissionais" && <div>Área de Profissionais</div>}
                    {abaAtiva === "clientes" && <div>Área de Clientes</div>}
                    {abaAtiva === "servicos" && <div>Área de Serviços</div>}
                </div>
            </div>
        </main>
    );
}

 