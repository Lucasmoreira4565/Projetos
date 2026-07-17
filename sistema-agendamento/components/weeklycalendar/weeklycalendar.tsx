import { useState } from "react";
import { addDays, format, isSameDay, startOfWeek, subDays,isBefore,startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";



interface WeeklyCalendarProps {
    dataSelecionada: Date;
    setDataSelecionada: (date: Date) => void;
}

export default function WeeklyCalendar({
    dataSelecionada,
    setDataSelecionada,
}: WeeklyCalendarProps) {
    const hoje = startOfDay(new Date());
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
        
        <div className="mb-1 text-left md:w-[512px] max-w-4xl mx-auto px-0">

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-zinc-400">
                    Selecione o Dia:
                </h3>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={voltarSemana}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer text-xs"
                    >
                        ← Anterior
                    </button>
                    <button
                        type="button"
                        onClick={avancarSemana}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer text-xs"
                    >
                        Próxima →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 w-full max-w-lg mx-auto "> 
                {diasDaSemana.map((dia) => {
                    const selecionado = dataSelecionada && isSameDay(dia, dataSelecionada);
                    const diaZerado = startOfDay(dia);
                    const estaNoPassado = isBefore(diaZerado, hoje);
                    const diaSemanaNum = dia.getDay();
                    const finalDeSemana = diaSemanaNum === 0 || diaSemanaNum === 6;
                    if (finalDeSemana) return null;

                    return (
                        <button
                            key={dia.toString()}
                            disabled={estaNoPassado}
                            onClick={() => setDataSelecionada(dia)}
                            className={`flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl transition w-full min-w-0
                          ${selecionado
                                    ? "bg-zinc-100 text-black font-bold"
                                    : estaNoPassado
                                        ? "bg-zinc-900/40 text-zinc-600 opacity-30 cursor-not-allowed pointer-events-none"
                                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                }`}
                        >
                
                            <span className="text-[10px] sm:text-xs uppercase font-medium tracking-wider block text-center truncate w-full">
                                {format(dia, "eee", { locale: ptBR })}
                            </span>
                            <span className="text-base sm:text-lg font-bold mt-1 block text-center w-full">
                                {format(dia, "d")}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}