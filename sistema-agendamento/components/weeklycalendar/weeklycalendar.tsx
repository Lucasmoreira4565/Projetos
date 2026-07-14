import { useState } from "react";
import { addDays, format, isSameDay, startOfWeek, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";


interface WeeklyCalendarProps {
    dataSelecionada: Date;
    setDataSelecionada: (date: Date) => void;
}

export default function WeeklyCalendar({
    dataSelecionada,
    setDataSelecionada,
}: WeeklyCalendarProps) {
    const [dataInicioSemana, setDataInicioSemana] = useState<Date>(new Date());
    const segundaFeira = startOfWeek(dataInicioSemana, { weekStartsOn: 1 });
    const diasDaSemana = Array.from({ length: 5 }, (_, i) => addDays(segundaFeira, i));
    const avancarSemana = () => setDataInicioSemana(prev => addDays(prev, 7));
    const voltarSemana = () => {
        const anterior = subDays(dataInicioSemana, 7);
        if (anterior >= subDays(new Date(), 1)) {
            setDataInicioSemana(anterior);
        }
    };

    return (
        <div className="mb-6 text-left w-full">
            
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-zinc-400">
                    Selecione o Dia:
                </h3>

              
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={voltarSemana}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                        ← Anterior
                    </button>
                    <button
                        type="button"
                        onClick={avancarSemana}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                        Próxima →
                    </button>
                </div>
            </div>

            
            <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
                {diasDaSemana.map((dia) => {
                    const selecionado = dataSelecionada && isSameDay(dia, dataSelecionada);
                    const nomeDia = format(dia, "eee", { locale: ptBR });
                    const numeroDia = format(dia, "d");

                    const diaSemanaNum = dia.getDay();
                    const finalDeSemana = diaSemanaNum === 0 || diaSemanaNum === 6;
                    if (finalDeSemana) return null;

                    return (
                        <button
                            key={dia.toISOString()}
                            type="button"
                            onClick={() => setDataSelecionada(dia)}
                            className={`flex-1 min-w-[55px] p-3 rounded-2xl flex flex-col items-center transition cursor-pointer border ${selecionado
                                    ? "bg-zinc-100 border-white text-black font-bold"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }`}
                        >
                            <span className="text-xs uppercase opacity-80">{nomeDia}</span>
                            <span className="text-lg font-bold mt-1">{numeroDia}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}