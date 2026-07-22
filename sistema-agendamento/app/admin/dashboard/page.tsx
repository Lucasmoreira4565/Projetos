"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/lib/supabase/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle } from "lucide-react";

export default function DashboardPage() {
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const router = useRouter();
    const [filtroPeriodo, setFiltroPeriodo] = useState<"hoje" | "semana" | "mes">("hoje");

    useEffect(() => {
        async function buscarAgendamentos() {
            const supabase = createClient();

            /* 
            // Descomente esta parte após testar a exibição dos dados:
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              router.push("/admin/login");
              return;
            }
            */

            console.log("🔍 BUSCANDO DADOS NO SUPABASE...");

            // 1. Busca Agendamentos e Serviços em paralelo
            const { data: agendamentosData, error: errAg } = await supabase
                .from("agendamento")
                .select("*");

            const { data: servicosData, error: errServ } = await supabase
                .from("servicos")
                .select("*");

            console.log("AGENDAMENTOS RETORNADOS:", agendamentosData);
            console.log("SERVIÇOS RETORNADOS:", servicosData);

            if (errAg || errServ) {
                console.error("Erro ao buscar no Supabase:", errAg || errServ);
            }

            if (agendamentosData && Array.isArray(agendamentosData)) {
                // 2. Mapeia cruzando com o serviço correto
                const combinados = agendamentosData.map((item) => {
                    const servicoEncontrado = servicosData?.find(
                        (s) => s.id === item.servico_id || s.nome === item.servico
                    );
                    return {
                        ...item,
                        servico: servicoEncontrado,
                    };
                });

                // 3. Ordena por data (mais recentes primeiro)
                combinados.sort(
                    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
                );

                setAgendamentos(combinados);
            }

            setCarregando(false);
        }

        buscarAgendamentos();
    }, [router]);

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
    }

    function formatarDataBR(dataString: string) {
        if (!dataString) return "";
        const data = new Date(dataString);
        return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    }

    function formatarPrimeiroNome(nomeCompleto: string) {
        if (!nomeCompleto) return "";
        const primeiroNome = nomeCompleto.trim().split(" ")[0];
        return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
    }

    function obterLinkWhatsapp(telefone: string, nomeCliente: string) {
        const apenasNumeros = String(telefone).replace(/\D/g, "");
        const nomeFormatado = formatarPrimeiroNome(nomeCliente);
        const mensagem = encodeURIComponent(
            `Olá, ${nomeFormatado}! Tudo bem? Gostaria de confirmar seu agendamento na Moreira's Barber.`
        );
        return `https://wa.me/${apenasNumeros}?text=${mensagem}`;
    }

    // --- LÓGICA DE FILTRAGEM SEGURA DE DATA ---
    const agendamentosFiltrados = agendamentos.filter((item) => {
        if (!item.data) return false;

        // Converte a string YYYY-MM-DD mantendo fuso local
        const dataItem = new Date(item.data);
        const hoje = new Date();

        if (filtroPeriodo === "hoje") {
            return (
                dataItem.getDate() === hoje.getDate() &&
                dataItem.getMonth() === hoje.getMonth() &&
                dataItem.getFullYear() === hoje.getFullYear()
            );
        }

        if (filtroPeriodo === "semana") {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(hoje.getDate() - 7);
            return dataItem >= seteDiasAtras;
        }

        if (filtroPeriodo === "mes") {
            return (
                dataItem.getMonth() === hoje.getMonth() &&
                dataItem.getFullYear() === hoje.getFullYear()
            );
        }

        return true;
    });

    // --- CÁLCULO DO FATURAMENTO ESTIMADO ---
    const faturamentoTotal = agendamentosFiltrados.reduce((acumulador, item) => {
        const valor = Number(
            item.servico?.preco || item.servico?.valor || item.preco || 0
        );
        return acumulador + valor;
    }, 0);

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-gray-500 font-medium">Carregando painel...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Topo / Cabeçalho */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">Painel do Barbeiro</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                        Sair
                    </button>
                </div>

                {/* Botões do Filtro de Período */}
                <div className="flex gap-2 bg-gray-200/60 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setFiltroPeriodo("hoje")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition ${filtroPeriodo === "hoje"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Hoje
                    </button>

                    <button
                        onClick={() => setFiltroPeriodo("semana")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition ${filtroPeriodo === "semana"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Esta Semana
                    </button>

                    <button
                        onClick={() => setFiltroPeriodo("mes")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition ${filtroPeriodo === "mes"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Este Mês
                    </button>
                </div>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Atendimentos ({filtroPeriodo})
                        </span>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">
                            {agendamentosFiltrados.length}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Faturamento Estimado
                        </span>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                            {faturamentoTotal.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </p>
                    </div>
                </div>

                {/* Lista de Atendimentos */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Próximos Atendimentos
                    </h2>

                    {agendamentosFiltrados.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            Nenhum agendamento encontrado para este período.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {agendamentosFiltrados.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div>
                                        <p className="font-bold text-gray-900">{item.nome_completo}</p>

                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <a
                                                href={obterLinkWhatsapp(item.telefone, item.nome_completo)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-700 font-medium hover:underline flex items-center gap-1"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5 text-green-600 inline mr-1" />
                                                {item.telefone}
                                            </a>

                                            {item.email && (
                                                <>
                                                    <span>•</span>
                                                    <span>{item.email}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <span className="text-sm font-semibold bg-zinc-900 text-white px-3 py-1 rounded-md">
                                        {formatarDataBR(item.data)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}