"use client";

import { useState,useEffect } from "react";
import { createClient } from "@/supabase/lib/supabase/client";
import BannerHeader from "@/components/bannerheader";
import Calendar from "@/components/calendar";
import TimeSlots from "@/components/timeslots";

export default function Home() {
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [mesAtual, setMesAtual] = useState<Date>(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const supabase = createClient();
  
 useEffect(() => {
  async function buscarAgendamentos() {
    const supabase = createClient();
    const { data } = await supabase.from("agendamento").select();
    if (data) {
      setAgendamentos(data);
    }
  }
  buscarAgendamentos();
 }, []);

async function criarNovoAgendamento() {
  
  const ano = dataSelecionada?.getFullYear();
  const mes = String(dataSelecionada ? dataSelecionada.getMonth() + 1 : "").padStart(2, "0");
  const dia = String(dataSelecionada?.getDate()).padStart(2, "0");
  const dataStringFormatada = `${ano}-${mes}-${dia} ${horarioSelecionado}:00`;
  const { error } = await supabase
    .from("agendamento")
    .insert([
      {
        nome_completo: nome, 
        email: email,
        telefone: Number(telefone), 
      },
    ]);

  if (error) {
    console.error("Erro ao salvar agendamento:", error.message);
    alert("Falha ao salvar agendamento no banco!");
  } else {
    alert("Agendamento realizado com sucesso!");
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

          <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full mt-8">
            <Calendar
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
              mesAtual={mesAtual}
              setMesAtual={setMesAtual}
              setHorarioSelecionado={setHorarioSelecionado}
            />

            {dataSelecionada && (
              <TimeSlots
                dataSelecionada={dataSelecionada}
                horarioSelecionado={horarioSelecionado}
                setHorarioSelecionado={setHorarioSelecionado}
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
            )}
          </div>

        </div>
      </main>
    </div>
  );
}