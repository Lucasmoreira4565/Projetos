interface TimeSlotsProps {
  dataSelecionada: Date;
  horarioSelecionado: string | null;
  setHorarioSelecionado: (hora: string | null) => void;
  nome: string;
  setNome: (nome: string) => void;
  telefone: string;
  setTelefone: (tel: string) => void;
  email: string;
  setEmail: (email: string) => void;
  isModalAberto: boolean;
  setIsModalAberto: (aberto: boolean) => void;
  agendamentos: {
    id: number;
    Nome_completo: string| null;
    Email: string| null;
    Telefone: number| null;
    data: string;
  }[];
  criarNovoAgendamento: () => Promise<void>;
  erroValidacao: boolean;
  setErroValidacao: (valor: boolean) => void;
}

export default function TimeSlots({
  dataSelecionada,
  horarioSelecionado,
  setHorarioSelecionado,
  nome,
  setNome,
  telefone,
  setTelefone,
  email,
  setEmail,
  isModalAberto,
  setIsModalAberto,
  agendamentos,
  criarNovoAgendamento,
  erroValidacao,
  setErroValidacao
}: TimeSlotsProps) {
  const horariosDisponiveis = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
  const ano = dataSelecionada.getFullYear();
  const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0");
  const dia = String(dataSelecionada.getDate()).padStart(2, "0");
  const dataFormatada = `${ano}-${mes}-${dia}`;

 
  return (
    <div className="max-w-sm md:max-w-lg bg-[#121212] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-2xl flex flex-col items-center justify-center mx-auto transition-all duration-300">
      <h3 className="text-2xl font-semibold text-zinc-200 mb-4">Horários disponíveis:</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-6 px-2">
        {horariosDisponiveis.map((hora) => {
          const estaSelecionado = hora === horarioSelecionado;
          const horarioOcupado = agendamentos.some((agenda: any) => {
            const apenasDataDoBanco = agenda.data.split(" ")[0] || agenda.data.substring(0, 10);
            const mesmaHora = agenda.data.includes(hora);
            return apenasDataDoBanco === dataFormatada && mesmaHora;
            });

            if (horarioOcupado) return null;
            
          return (
            <button
              key={hora}
              type="button"
              onClick={() => setHorarioSelecionado(hora)}
              className={`p-3 border rounded-xl text-center font-medium transition cursor-pointer text-sm block w-full ${
                estaSelecionado
                  ? "bg-zinc-100 border-white text-black font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {hora}
            </button>
          );
        })}
      </div>

      {isModalAberto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="w-full max-w-md bg-[#161616] border border-zinc-800 rounded-2xl p-6 shadow-2xl text-left relative">
            <h3 className="text-xl font-bold text-zinc-100 mb-6">Finalizar Agendamento</h3>

            <div className="mb-4">
              <label className={`block text-xs font-medium mb-2 transition-colors $
              {erroValidacao && !nome ? "text-red-500" : "text-zinc-400"
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

            <div className="mb-4">
              <label className={`block text-xs font-medium mb-2 transition-colors $
              {erroValidacao && !telefone ? "text-red-500" : "text-zinc-400"
                }`}>
                Telefone / WhatsApp {erroValidacao && !telefone && <span className="text-[10px]">(Obrigatório)</span>}
              </label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value);
                  if (erroValidacao) setErroValidacao(false);
                }}
                className={`w-full p-3 bg-zinc-900 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none transition text-sm 
                  ${erroValidacao && !telefone
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-zinc-800 focus:border-zinc-500"
                  }`}
              />
            </div>

            <div className="mb-6">
              <label className={`block text-xs font-medium mb-2 transition-colors ${erroValidacao && !email ? "text-red-500" : "text-zinc-400"
                }`}>
                E-mail {erroValidacao && !email && <span className="text-[10px]">(Obrigatório)</span>}
              </label>
              <input
                type="email"
                placeholder="joao@email.com"
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
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalAberto(false);
                  setErroValidacao(false); 
                }}
                className="flex-1 p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-medium rounded-xl transition cursor-pointer text-center text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={criarNovoAgendamento}
                className="flex-1 p-3 bg-zinc-100 hover:bg-zinc-200 text-black font-bold rounded-xl transition cursor-pointer text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}