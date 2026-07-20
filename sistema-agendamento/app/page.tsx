"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/lib/supabase/client";
import BannerHeader from "@/components/bannerheader";
import TimeSlots from "@/components/timeslots";
import SelectorServicos from "@/components/seletorservicos";
import SelectorProfissionais from "@/components/seletorprofissionais";
import WeeklyCalendar from "@/components/weeklycalendar";
import BackgroundLayout from "@/components/backgroundlayout";

export default function Home() {
  const [erroValidacao, setErroValidacao] = useState(false);
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
     if (!dataSelecionada || !horarioSelecionado || !nome || !telefone || !email || !servicoSelecionado || !profissionalSelecionado) {
       console.log("Validação falhou! Ativando erroValidacao...");
      setErroValidacao(true);

      return;
    }
        setErroValidacao(false);
    try {
      const ano = dataSelecionada.getFullYear();
      const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0");
      const dia = String(dataSelecionada.getDate()).padStart(2, "0");
      const dataStringFormatada = `${ano}-${mes}-${dia} ${horarioSelecionado}`;
      const { data, error } = await supabase
        .from("agendamento")
        .insert([
          {
            nome_completo: nome,
            email: email,
            telefone: Number(telefone), 
            data: dataStringFormatada,
            servico_id: servicoSelecionado,
            profissional_id: profissionalSelecionado,
          },
        ])
        .select();

      
      if (error) {
        console.error("Erro retornado pelo Supabase:", error.message);
        alert(`Falha ao registrar agendamento: ${error.message}`);
        return;
      }
      
      setNome("");
      setTelefone("");
      setEmail("");
      setHorarioSelecionado(null);
      setEtapa(1); 
    } catch (err) {
      console.error("Erro inesperado ao criar agendamento:", err);
    }
  }

    return (
    <BackgroundLayout>
      <div className="w-full bg-[#363636]/80 border border-zinc-500/100 rounded-3xl p-2 sm:p-10 mb-8 flex flex-col items-center shadow-2xl">

          <BannerHeader />
          <div className="w-full max-w-4xl mx-auto bg-zinc-950/40 border border-zinc-800/30 rounded-3xl p-4 sm:p-6 backdrop-blur-md mt-6 sm:mt-8">

            {etapa === 1 && (
              <div className="flex flex-col gap-2 w-full max-w-md mx-auto animate-fade-in">
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
                    erroValidacao={erroValidacao}
                    setErroValidacao={setErroValidacao}
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
                  Próximo
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
                      <label className={`text-xs block mb-1 transition-colors ${erroValidacao && !nome ? "text-red-500 font-semibold" : "text-zinc-400"
                        }`}>
                        Nome Completo {erroValidacao && !nome && <span className="text-[10px]">(Obrigatório)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: João Silva"
                        value={nome}
                        onChange={(e) => {
                          setNome(e.target.value);
                          if (erroValidacao) setErroValidacao(false);
                        }}
                        className={`w-full p-3 bg-zinc-900 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none transition text-sm ${erroValidacao && !nome
                            ? "border-red-500/80 focus:border-red-500"
                            : "border-zinc-800 focus:border-zinc-500"
                          }`}
                      />
                    </div>

                    
                    <div>
                      <label className={`text-xs block mb-1 transition-colors ${erroValidacao && !telefone ? "text-red-500 font-semibold" : "text-zinc-400"
                        }`}>
                        Telefone (DDD + Número) {erroValidacao && !telefone && <span className="text-[10px]">(Obrigatório)</span>}
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 27999999999"
                        value={telefone}
                        onChange={(e) => {
                          setTelefone(e.target.value);
                          if (erroValidacao) setErroValidacao(false);
                        }}
                        className={`w-full p-3 bg-zinc-900 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none transition text-sm ${erroValidacao && !telefone
                            ? "border-red-500/80 focus:border-red-500"
                            : "border-zinc-800 focus:border-zinc-500"
                          }`}
                      />
                    </div>

                    
                    <div>
                      <label className={`text-xs block mb-1 transition-colors ${erroValidacao && !email ? "text-red-500 font-semibold" : "text-zinc-400"
                        }`}>
                        E-mail {erroValidacao && !email && <span className="text-[10px]">(Obrigatório)</span>}
                      </label>
                      <input
                        type="email"
                        placeholder="Ex: joao@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (erroValidacao) setErroValidacao(false);
                        }}
                        className={`w-full p-3 bg-zinc-900 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none transition text-sm ${erroValidacao && !email
                            ? "border-red-500/80 focus:border-red-500"
                            : "border-zinc-800 focus:border-zinc-500"
                          }`}
                      />

                      <button
                        type="button"
                        onClick={criarNovoAgendamento}
                        className="w-full p-4 bg-green-800 hover:bg-green-700 text-white font-bold rounded-xl transition cursor-pointer text-center block mt-6"
                      >
                        Realizar Agendamento!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
     </BackgroundLayout>
   
  );
}