"use client";

import { useState } from "react";
import "react-day-picker/dist/style.css";

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
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}