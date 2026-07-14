interface SelectorServicosProps {
  servicos: any[];
  servicoSelecionado: number | null;
  setServicoSelecionado: (id: number) => void;
}

export default function SelectorServicos({
  servicos,
  servicoSelecionado,
  setServicoSelecionado,
}: SelectorServicosProps) {
  return (
    <div className="mb-6 text-left">
      <h3 className="text-sm font-semibold text-zinc-400 mb-3">Escolha o Serviço</h3>
      <div className="grid grid-cols-2 gap-3">
        {servicos.map((servico) => {
          const selecionado = servico.id === servicoSelecionado;
          return (
            <button
              key={servico.id}
              type="button"
              onClick={() => setServicoSelecionado(servico.id)}
              className={`p-4 border rounded-xl text-left transition cursor-pointer ${
                selecionado
                  ? "bg-zinc-100 border-white text-black font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <p className="font-semibold text-sm">{servico.nome}</p>
              <p className="text-xs opacity-80">R$ {servico.preco}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
