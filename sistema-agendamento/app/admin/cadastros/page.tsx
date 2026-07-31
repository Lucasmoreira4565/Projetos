"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Scissors, Users, Wrench } from "lucide-react";

export default function CadastrosPage() {
    const router = useRouter();
    const supabase = createClient();
    const [abaAtiva, setAbaAtiva] = useState<"profissionais" | "clientes" | "servicos">("profissionais");
    const [carregando, setCarregando] = useState(true);

    // --- ESTADOS: Listas do Banco ---
    const [profissionais, setProfissionais] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);

    // --- ESTADOS: Form Cliente ---
    const [nomeCliente, setNomeCliente] = useState("");
    const [telefoneCliente, setTelefoneCliente] = useState("");
    const [emailCliente, setEmailCliente] = useState("");
    const [idClienteEmEdicao, setIdClienteEmEdicao] = useState<number | null>(null);

    // --- ESTADOS: Form Profissional ---
    const [nomeProfissional, setNomeProfissional] = useState("");
    const [emailProfissional, setEmailProfissional] = useState("");
    const [especialidadeProfissional, setEspecialidadeProfissional] = useState("");
    const [idProfissionalEmEdicao, setIdProfissionalEmEdicao] = useState<number | null>(null);

    // --- ESTADOS: Form Serviço ---
    const [nomeServico, setNomeServico] = useState("");
    const [precoServico, setPrecoServico] = useState("");
    const [duracaoServico, setDuracaoServico] = useState("");
    const [idServicoEmEdicao, setIdServicoEmEdicao] = useState<number | null>(null);

    // --- CARREGAR DADOS DO SUPABASE ---
    async function carregarDados() {
        const { data: profData } = await supabase.from("profissionais").select("*");
        if (profData) setProfissionais(profData);

        const { data: servData } = await supabase.from("servicos").select("*");
        if (servData) setServicos(servData);

        const { data: cliData } = await supabase.from("clientes").select("*");
        if (cliData) setClientes(cliData);
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

    // ==========================================
    // 1. LÓGICA DE CLIENTES
    // ==========================================
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
                .update({ nome_completo: nomeCliente, telefone: telefoneCliente, email: emailCliente })
                .eq("id", idClienteEmEdicao);
        } else {
            resposta = await supabase
                .from("clientes")
                .insert([{ nome_completo: nomeCliente, telefone: telefoneCliente, email: emailCliente }]);
        }

        if (resposta.error) {
            alert(`Erro ao salvar cliente: ${resposta.error.message}`);
            return;
        }

        limparFormularioCliente();
        await carregarDados();
    }

    function prepararEdicaoCliente(cliente: any) {
        setIdClienteEmEdicao(cliente.id);
        setNomeCliente(cliente.nome_completo || cliente.nome || "");
        setTelefoneCliente(cliente.telefone || "");
        setEmailCliente(cliente.email || "");
    }

    // ==========================================
    // 2. LÓGICA DE PROFISSIONAIS
    // ==========================================
    function limparFormularioProfissional() {
        setIdProfissionalEmEdicao(null);
        setNomeProfissional("");
        setEmailProfissional("");
        setEspecialidadeProfissional("");
    }

    async function handleSalvarProfissional(e: React.FormEvent) {
        e.preventDefault();
        let resposta;

        const dados = {
            nome: nomeProfissional,
            email: emailProfissional,
            especialidade: especialidadeProfissional,
        };

        if (idProfissionalEmEdicao) {
            resposta = await supabase
                .from("profissionais")
                .update(dados)
                .eq("id", idProfissionalEmEdicao);
        } else {
            resposta = await supabase
                .from("profissionais")
                .insert([dados]);
        }

        if (resposta.error) {
            alert(`Erro ao salvar profissional: ${resposta.error.message}`);
            return;
        }

        limparFormularioProfissional();
        await carregarDados();
    }

    function prepararEdicaoProfissional(profissional: any) {
        setIdProfissionalEmEdicao(profissional.id);
        setNomeProfissional(profissional.nome || "");
        setEmailProfissional(profissional.email || "");
        setEspecialidadeProfissional(profissional.especialidade || "");
    }

    // ==========================================
    // 3. LÓGICA DE SERVIÇOS
    // ==========================================
    function limparFormularioServico() {
        setIdServicoEmEdicao(null);
        setNomeServico("");
        setPrecoServico("");
        setDuracaoServico("");
    }

    async function handleSalvarServico(e: React.FormEvent) {
        e.preventDefault();
        let resposta;

        const dados = {
            nome: nomeServico,
            preco: Number(precoServico),
            duracao: duracaoServico ? Number(duracaoServico) : null,
        };

        if (idServicoEmEdicao) {
            resposta = await supabase
                .from("servicos")
                .update(dados)
                .eq("id", idServicoEmEdicao);
        } else {
            resposta = await supabase
                .from("servicos")
                .insert([dados]);
        }

        if (resposta.error) {
            alert(`Erro ao salvar serviço: ${resposta.error.message}`);
            return;
        }

        limparFormularioServico();
        await carregarDados();
    }

    function prepararEdicaoServico(servico: any) {
        setIdServicoEmEdicao(servico.id);
        setNomeServico(servico.nome || "");
        setPrecoServico(servico.preco ? String(servico.preco) : "");
        setDuracaoServico(servico.duracao ? String(servico.duracao) : "");
    }

    // ==========================================
    // RENDERS DAS ABAS
    // ==========================================
    function renderizarAbaProfissionais() {
        return (
            <div className="space-y-6">
                <form onSubmit={handleSalvarProfissional} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">
                        {idProfissionalEmEdicao ? "✏️ Editar Profissional" : "➕ Novo Profissional"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Nome do Profissional"
                            value={nomeProfissional}
                            onChange={(e) => setNomeProfissional(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={emailProfissional}
                            onChange={(e) => setEmailProfissional(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        <input
                            type="text"
                            placeholder="Especialidade (ex: Cabeleireiro, Barbeiro)"
                            value={especialidadeProfissional}
                            onChange={(e) => setEspecialidadeProfissional(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        {idProfissionalEmEdicao && (
                            <button
                                type="button"
                                onClick={limparFormularioProfissional}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md transition"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition cursor-pointer"
                        >
                            {idProfissionalEmEdicao ? "Atualizar Profissional" : "Cadastrar Profissional"}
                        </button>
                    </div>
                </form>

                <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3">Profissionais Cadastrados ({profissionais.length})</h3>
                    <div className="space-y-2">
                        {profissionais.map((prof) => (
                            <div key={prof.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{prof.nome}</p>
                                    <p className="text-xs text-gray-500">{prof.especialidade || "Sem especialidade"} • {prof.email || "Sem e-mail"}</p>
                                </div>
                                <button
                                    onClick={() => prepararEdicaoProfissional(prof)}
                                    className="px-3 py-1 text-xs font-semibold text-zinc-800 bg-white border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
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
                            className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition cursor-pointer"
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
                                    <p className="font-semibold text-sm text-gray-800">{cliente.nome_completo || cliente.nome}</p>
                                    <p className="text-xs text-gray-500">{cliente.telefone} • {cliente.email || "Sem e-mail"}</p>
                                </div>
                                <button
                                    onClick={() => prepararEdicaoCliente(cliente)}
                                    className="px-3 py-1 text-xs font-semibold text-zinc-800 bg-white border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
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

    function renderizarAbaServicos() {
        return (
            <div className="space-y-6">
                <form onSubmit={handleSalvarServico} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">
                        {idServicoEmEdicao ? "✏️ Editar Serviço" : "➕ Novo Serviço"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Nome do Serviço (ex: Corte Social)"
                            value={nomeServico}
                            onChange={(e) => setNomeServico(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Preço (ex: 50.00)"
                            value={precoServico}
                            onChange={(e) => setPrecoServico(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        <input
                            type="number"
                            placeholder="Duração em min (ex: 30)"
                            value={duracaoServico}
                            onChange={(e) => setDuracaoServico(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        {idServicoEmEdicao && (
                            <button
                                type="button"
                                onClick={limparFormularioServico}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md transition"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition cursor-pointer"
                        >
                            {idServicoEmEdicao ? "Atualizar Serviço" : "Cadastrar Serviço"}
                        </button>
                    </div>
                </form>

                <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3">Serviços Cadastrados ({servicos.length})</h3>
                    <div className="space-y-2">
                        {servicos.map((servico) => (
                            <div key={servico.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{servico.nome}</p>
                                    <p className="text-xs text-gray-500">
                                        R$ {Number(servico.preco || 0).toFixed(2)}
                                        {servico.duracao ? ` • ${servico.duracao} min` : ""}
                                    </p>
                                </div>
                                <button
                                    onClick={() => prepararEdicaoServico(servico)}
                                    className="px-3 py-1 text-xs font-semibold text-zinc-800 bg-white border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
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
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </button>
                </div>

                {/* ABAS */}
                <div className="flex gap-2 border-b border-gray-200 bg-white p-2 rounded-t-lg">
                    <button
                        onClick={() => setAbaAtiva("profissionais")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition cursor-pointer ${abaAtiva === "profissionais"
                                ? "bg-zinc-900 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Scissors className="w-4 h-4" />
                        Profissionais
                    </button>

                    <button
                        onClick={() => setAbaAtiva("clientes")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition cursor-pointer ${abaAtiva === "clientes"
                                ? "bg-zinc-900 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Clientes
                    </button>

                    <button
                        onClick={() => setAbaAtiva("servicos")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition cursor-pointer ${abaAtiva === "servicos"
                                ? "bg-zinc-900 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Wrench className="w-4 h-4" />
                        Serviços
                    </button>
                </div>

                {/* CONTEÚDO ATIVO */}
                <div className="bg-white p-6 rounded-b-lg border border-gray-200">
                    {abaAtiva === "profissionais" && renderizarAbaProfissionais()}
                    {abaAtiva === "clientes" && renderizarAbaClientes()}
                    {abaAtiva === "servicos" && renderizarAbaServicos()}
                </div>
            </div>
        </main>
    );
}