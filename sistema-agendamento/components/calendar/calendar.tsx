import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";

// Definindo o tipo das Props para o TypeScript
interface CalendarProps {
  dataSelecionada: Date | undefined;
  setDataSelecionada: (date: Date | undefined) => void;
  mesAtual: Date;
  setMesAtual: (date: Date) => void;
  setHorarioSelecionado: (hora: string | null) => void;
}

export default function Calendar({
  dataSelecionada,
  setDataSelecionada,
  mesAtual,
  setMesAtual,
  setHorarioSelecionado,
}: CalendarProps) {
  return (
    <div className="flex justify-center w-full md:w-auto">
      <DayPicker
        mode="single"
        selected={dataSelecionada}
        onSelect={(dia) => {
          setDataSelecionada(dia);
          setHorarioSelecionado(null);
        }}
        month={mesAtual}
        onMonthChange={setMesAtual}
        locale={ptBR}
        disabled={(date) => {
          const diaDaSemana = date.getDay();
          const hoje = new Date();
          return diaDaSemana === 0 || diaDaSemana === 6 || date < hoje;
        }}
        classNames={{
          months: "relative flex flex-col",
          month: "flex flex-col gap-4",
          month_caption: "flex justify-center items-center h-10 relative",
          caption_label: "text-zinc-100 font-bold text-lg absolute left-4",
          nav: "flex items-center gap-1 absolute right-4 z-10",
          button_previous: "text-zinc-400 hover:text-zinc-100 transition p-1 cursor-pointer",
          button_next: "text-zinc-400 hover:text-zinc-100 transition p-1 cursor-pointer",
          month_grid: "w-full border-collapse mt-2",
          weekdays: "flex justify-between",
          weekday: "text-zinc-400 font-medium w-10 h-10 flex items-center justify-center text-sm",
          week: "flex justify-between w-full mt-1",
          day: "text-zinc-300 w-10 h-10 flex items-center justify-center hover:bg-zinc-800 rounded-full transition cursor-pointer text-sm",
          today: "border border-zinc-600 font-bold text-zinc-100",
          selected: "!bg-zinc-100 !text-black font-bold rounded-full",
          chevron: "fill-zinc-400 text-zinc-400 w-5 h-5",
          disabled: "text-zinc-700 opacity-30 pointer-events-none cursor-not-allowed",
        }}
      />
    </div>
  );
}