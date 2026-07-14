"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/lib/supabase/client";
import BannerHeader from "@/components/bannerheader";
import TimeSlots from "@/components/timeslots";
import SelectorServicos from "@/components/seletorservicos";
import SelectorProfissionais from "@/components/seletorprofissionais";
import WeeklyCalendar from "@/components/weeklycalendar";


export default function Home() {
  const [mesAtual, setMesAtual] = useState<Date>(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const supabase = createClient();
  const [servicos, setServicos] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<number | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [etapa, setEtapa] = useState<number>(1);

  useEffect(() => {
    async function carregarDados() {
      const supabase = createClient();
      const { data } = await supabase.from("agendamento").select();
      if (data) { setAgendamentos(data); }
      const { data: servicosData } = await supabase.from("servicos").select();
      if (servicosData) setServicos(servicosData);
      const { data: profissionaisData } = await supabase.from("profissionais").select();
      if (profissionaisData) setProfissionais(profissionaisData);
    }
    carregarDados();
  }, []);

  async function criarNovoAgendamento() {

    const ano = dataSelecionada?.getFullYear();
    const mes = String(dataSelecionada ? dataSelecionada.getMonth() + 1 : "").padStart(2, "0");
    const dia = String(dataSelecionada?.getDate()).padStart(2, "0");
    const dataStringFormatada = `${ano}-${mes}-${dia} ${horarioSelecionado}:00`;
    const { error } = await supabase.
      from("agendamento")
      .insert([
        {
          nome_completo: nome,
          email: email,
          telefone: Number(telefone),
          data: dataStringFormatada,
          servico_id: servicoSelecionado,
          profissional_id: profissionalSelecionado,
        },
      ]);

    if (error) {
      console.error("Erro ao salvar agendamento:", error.message);
      alert("Falha ao salvar agendamento no banco!");
    } else {
      setIsModalAberto(false);

      const { data } = await supabase.from("agendamento").select();
      if (data) setAgendamentos(data);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#000000] text-[#ededed] p-8">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <div className="w-full bg-[#363636] border border-zinc-500/100 rounded-3xl p-10 mb-8 flex flex-col items-center">

          <BannerHeader />

          
          <div className="w-full max-w-4xl mx-auto bg-zinc-950/40 border border-zinc-800/30 rounded-3xl p-6 backdrop-blur-md">

            {etapa === 1 && (
              <div className="flex flex-col gap-6">
                <WeeklyCalendar
                  dataSelecionada={dataSelecionada}
                  setDataSelecionada={setDataSelecionada}
                />

                
                
                  <TimeSlots
                    dataSelecionada={dataSelecionada}
                    horarioSelecionado={horarioSelecionado}
                    setHorarioSelecionado={(hora) => {
                      setHorarioSelecionado(hora);
                      setEtapa(2); 
                    }}
                    nome={nome}
                    setNome={setNome}
                    telefone={telefone}
                    setTelefone={setTelefone}
                    email={email}
                    setEmail={setEmail}
                    isModalAberto={isModalAberto}
                    setIsModalAberto={setIsModalAberto}
                    agendamentos={agendamentos}
                    criarNovoAgendamento={criarNovoAgendamento}
                  />
                </div>
             
            )}


            {etapa === 2 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setEtapa(1)}
                    className="text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    ← Voltar para data e hora
                  </button>
                  <span className="text-xs text-zinc-500 font-medium">Passo 2 de 3</span>
                </div>

                <SelectorServicos
                  servicos={servicos}
                  servicoSelecionado={servicoSelecionado}
                  setServicoSelecionado={setServicoSelecionado}
                />

                <SelectorProfissionais
                  profissionais={profissionais}
                  profissionalSelecionado={profissionalSelecionado}
                  setProfissionalSelecionado={setProfissionalSelecionado}
                />


                <button
                  type="button"
                  disabled={!servicoSelecionado || !profissionalSelecionado}
                  onClick={() => setEtapa(3)}
                  className="w-full p-4 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition cursor-pointer text-center block"
                >
                  Avançar para Identificação
                </button>
              </div>
            )}

            {etapa === 3 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setEtapa(2)}
                    className="text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    ← Voltar para serviços
                  </button>
                  <span className="text-xs text-zinc-500 font-medium">Passo 3 de 3</span>
                </div>

                <div className="text-left bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Dados para o Agendamento</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Nome Completo</label>
                      <input
                        type="text"
                        placeholder="Ex: João Silva"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Telefone (DDD + Número)</label>
                      <input
                        type="tel"
                        placeholder="Ex: 27999999999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">E-mail</label>
                      <input
                        type="email"
                        placeholder="Ex: joao@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition text-sm"
                        />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}