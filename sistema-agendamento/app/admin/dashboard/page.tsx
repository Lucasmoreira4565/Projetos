"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/lib/supabase/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle,Calendar } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend,} from "recharts";

export default function DashboardPage() {
    const [tipoGraficoAtendimentos, setTipoGraficoAtendimentos] = useState<"linha" | "barra">("linha");
    const [tipoGraficoServicos, setTipoGraficoServicos] = useState<"barra" | "pizza">("pizza");
    const CORES_PIZZA = ["#18181b", "#059669", "#2563eb", "#d97706", "#dc2626"];
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const router = useRouter();
    const hojeStr = new Date().toISOString().split("T")[0];
    const [dataInicio, setDataInicio] = useState<string>(hojeStr);
    const [dataFim, setDataFim] = useState<string>(hojeStr);
    const [dataInicioAplicada, setDataInicioAplicada] = useState<string>(hojeStr);
    const [dataFimAplicada, setDataFimAplicada] = useState<string>(hojeStr);
    const [filtroPeriodo, setFiltroPeriodo] = useState<"hoje" | "semana" | "mes" | "customizado">("hoje");

    useEffect(() => {
        async function buscarAgendamentos() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              router.push("/admin/login");
              return;
            }
            const { data: agendamentosData, error: errAg } = await supabase
                .from("agendamento")
                .select("*");
            const { data: servicosData, error: errServ } = await supabase
                .from("servicos")
                .select("*");

            if (agendamentosData && Array.isArray(agendamentosData)) {
                const combinados = agendamentosData.map((item) => {
                    const servicoEncontrado = servicosData?.find(
                        (s) => s.id === item.servico_id || s.nome === item.servico
                    );
                    return {
                        ...item,
                        servico: servicoEncontrado,
                    };
                });

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

    function handleAplicarFiltro() {
        setDataInicioAplicada(dataInicio);
        setDataFimAplicada(dataFim);
    }
    
   
    const agendamentosFiltrados = agendamentos.filter((item) => {
        if (!item.data) return false;

        const dataItem = new Date(item.data);
        const hoje = new Date();
        const inicio = new Date(`${dataInicio}T00:00:00`);
        const fim = new Date(`${dataFim}T23:59:59`);

        if (filtroPeriodo === "hoje") {
            
            return (
                dataItem.getDate() === hoje.getDate() &&
                dataItem.getMonth() === hoje.getMonth() &&
                dataItem.getFullYear() === hoje.getFullYear() &&
                dataItem >= hoje
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

        if (filtroPeriodo === "customizado") {
            const inicio = new Date(`${dataInicioAplicada}T00:00:00`);
            const fim = new Date(`${dataFimAplicada}T23:59:59`);

            return dataItem >= inicio && dataItem <= fim;
            }
        return true;
    });

    const faturamentoTotal = agendamentosFiltrados.reduce((acumulador, item) => {
        const valor = Number(
            item.servico?.preco || item.servico?.valor || item.preco || 0
        );
        return acumulador + valor;
    }, 0);

    const dadosAtendimentos = prepararDadosAtendimentos(agendamentosFiltrados);
    const dadosServicos = prepararDadosServicos(agendamentosFiltrados);

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-gray-500 font-medium">Carregando painel...</p>
            </div>
        );
    }

    function prepararDadosAtendimentos(agendamentos: any[]) {
        const contagemPorData: { [key: string]: number } = {};

        agendamentos.forEach((item) => {
            if (!item.data) return;
            const dataFormatada = new Date(item.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
            });

            contagemPorData[dataFormatada] = (contagemPorData[dataFormatada] || 0) + 1;
        });

        return Object.keys(contagemPorData).map((data) => ({
            data,
            total: contagemPorData[data],
        }));
    }

    function prepararDadosServicos(agendamentos: any[]) {
        const contagemPorServico: { [key: string]: { quantidade: number; faturamento: number } } = {};

        agendamentos.forEach((item) => {
            const nomeServico = item.servico?.nome || item.servico || "Outros";
            const valor = Number(item.servico?.preco || item.servico?.valor || item.preco || 0);

            if (!contagemPorServico[nomeServico]) {
                contagemPorServico[nomeServico] = { quantidade: 0, faturamento: 0 };
            }

            contagemPorServico[nomeServico].quantidade += 1;
            contagemPorServico[nomeServico].faturamento += valor;
        });

        return Object.keys(contagemPorServico).map((nome) => ({
            nome,
            quantidade: contagemPorServico[nome].quantidade,
            faturamento: contagemPorServico[nome].faturamento,
        }));
    }
    
    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">Painel do Barbeiro</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                        Sair
                    </button>
                </div>

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
                    <button
                        onClick={() => setFiltroPeriodo("customizado")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-1.5 ${filtroPeriodo === "customizado"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <Calendar className="w-4 h-4 inline" />
                        Período Específico
                    </button>

                </div>
                {filtroPeriodo === "customizado" && (
                    <div className="flex gap-2 items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 mt-2">
                        <label className="text-sm font-medium text-gray-600">De:</label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="border border-gray-300 rounded p-1 text-sm text-gray-800"
                        />

                        <label className="text-sm font-medium text-gray-600">Até:</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="border border-gray-300 rounded p-1 text-sm text-gray-800"
                        />
                        <button
                            onClick={handleAplicarFiltro}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-3 py-2 rounded transition"
                        >
                            Filtrar
                        </button>
                    </div>
                )}
             
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold text-gray-800">Atendimentos no Período</h3>

                           
                            <div className="flex gap-1 bg-gray-100 p-1 rounded">
                                <button
                                    onClick={() => setTipoGraficoAtendimentos("linha")}
                                    className={`px-2 py-1 text-xs font-semibold rounded transition ${tipoGraficoAtendimentos === "linha"
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Linha
                                </button>
                                <button
                                    onClick={() => setTipoGraficoAtendimentos("barra")}
                                    className={`px-2 py-1 text-xs font-semibold rounded transition ${tipoGraficoAtendimentos === "barra"
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Barra
                                </button>
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {tipoGraficoAtendimentos === "linha" ? (
                                    <LineChart data={dadosAtendimentos}>
                                        <XAxis dataKey="data" stroke="#888888" fontSize={12} />
                                        <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="total" name="Atendimentos" stroke="#18181b" strokeWidth={2} />
                                    </LineChart>
                                ) : (
                                    <BarChart data={dadosAtendimentos}>
                                        <XAxis dataKey="data" stroke="#888888" fontSize={12} />
                                        <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="total" name="Atendimentos" fill="#18181b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* --- GRÁFICO 2: SERVIÇOS MAIS PEDIDOS / FATURAMENTO --- */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold text-gray-800">Serviços / Faturamento</h3>

                            {/* Botões para alternar o tipo de gráfico */}
                            <div className="flex gap-1 bg-gray-100 p-1 rounded">
                                <button
                                    onClick={() => setTipoGraficoServicos("pizza")}
                                    className={`px-2 py-1 text-xs font-semibold rounded transition ${tipoGraficoServicos === "pizza"
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Círculo
                                </button>
                                <button
                                    onClick={() => setTipoGraficoServicos("barra")}
                                    className={`px-2 py-1 text-xs font-semibold rounded transition ${tipoGraficoServicos === "barra"
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Barra
                                </button>
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {tipoGraficoServicos === "pizza" ? (
                                    <PieChart>
                                        <Pie
                                            data={dadosServicos}
                                            dataKey="faturamento"
                                            nameKey="nome"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={true}
                                        >
                                            {dadosServicos.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                                        <Legend />
                                    </PieChart>
                                ) : (
                                    <BarChart data={dadosServicos}>
                                        <XAxis dataKey="nome" stroke="#888888" fontSize={12} />
                                        <YAxis stroke="#888888" fontSize={12} />
                                        <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                                        <Bar dataKey="faturamento" name="Faturamento (R$)" fill="#059669" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
                
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