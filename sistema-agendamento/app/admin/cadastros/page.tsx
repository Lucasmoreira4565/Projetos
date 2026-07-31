"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/supabase/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Scissors, Users, Wrench } from "lucide-react";

export default function CadastrosPage() {
    const router = useRouter();
    const supabase = createClient();
    const [abaAtiva, setAbaAtiva] = useState<"profissionais" | "clientes" | "servicos">("profissionais");
    const [profissionais, setProfissionais] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [nomeCliente, setNomeCliente] = useState("");
    const [telefoneCliente, setTelefoneCliente] = useState("");
    const [emailCliente, setEmailCliente] = useState("");
    const [idClienteEmEdicao, setIdClienteEmEdicao] = useState<number | null>(null);
    const dataAtual: string = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(new Date())

    async function carregarDados() {
        const { data: profData } = await supabase.from("profissionais").select("*");
        if (profData) setProfissionais(profData);

        const { data: servData } = await supabase.from("servicos").select("*");
        if (servData) setServicos(servData);

        const { data: cliData } = await supabase.from("clientes").select("*");
        if (cliData) setClientes(cliData);
    }

    function limparFormularioCliente() {
        setIdClienteEmEdicao(null);
        setNomeCliente("");
        setTelefoneCliente("");
        setEmailCliente("");
    }

    async function handleSalvarCliente(e: React.FormEvent) {
        e.preventDefault();

        let resposta;

        if (idClienteEmEdicao) {
            resposta = await supabase
                .from("clientes")
                .update({ nome_completo: nomeCliente, telefone: telefoneCliente, email: emailCliente, criado_em: dataAtual })
                .eq("id", idClienteEmEdicao);
        } else {
            resposta = await supabase
                .from("clientes")
                .insert([{ nome_completo: nomeCliente, telefone: telefoneCliente, email: emailCliente, criado_em: dataAtual}]);
        }


        if (resposta.error) {
            console.error("Erro do Supabase:", resposta.error.message);
            alert(`Erro ao salvar: ${resposta.error.message}`);
            return;
        }

        console.log("Salvo com sucesso!");
        limparFormularioCliente();
        await carregarDados();
    }

    function prepararEdicaoCliente(cliente: any) {
        setIdClienteEmEdicao(cliente.id);
        setNomeCliente(cliente.nome_completo);
        setTelefoneCliente(cliente.telefone);
        setEmailCliente(cliente.email || "");
    }

    useEffect(() => {
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

    function renderizarAbaClientes() {
        return (
            <div className="space-y-6">
                <form onSubmit={handleSalvarCliente} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">
                        {idClienteEmEdicao ? "✏️ Editar Cliente" : "➕ Novo Cliente"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        <input
                            type="text"
                            placeholder="Telefone / WhatsApp"
                            value={telefoneCliente}
                            onChange={(e) => setTelefoneCliente(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        <input
                            type="email"
                            placeholder="E-mail (opcional)"
                            value={emailCliente}
                            onChange={(e) => setEmailCliente(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        {idClienteEmEdicao && (
                            <button
                                type="button"
                                onClick={limparFormularioCliente}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md transition"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
                        >
                            {idClienteEmEdicao ? "Atualizar Cliente" : "Cadastrar Cliente"}
                        </button>
                    </div>
                </form>

                <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3">Clientes Cadastrados ({clientes.length})</h3>
                    <div className="space-y-2">
                        {clientes.map((cliente) => (
                            <div key={cliente.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{cliente.nome}</p>
                                    <p className="text-xs text-gray-500">{cliente.telefone} • {cliente.email || "Sem e-mail"}</p>
                                </div>
                                <button
                                    onClick={() => prepararEdicaoCliente(cliente)}
                                    className="px-3 py-1 text-xs font-semibold text-zinc-800 bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
                                >
                                    Editar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Carregando permissões...</p>
            </div>
        );
    }

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
                    {abaAtiva === "clientes" && renderizarAbaClientes()}
                    {abaAtiva === "servicos" && <div>Área de Serviços</div>}
                </div>
            </div>
        </main>
    );
}