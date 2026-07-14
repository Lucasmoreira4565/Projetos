interface SelectorProfissionaisProps {
  profissionais: any[];
  profissionalSelecionado: number | null;
  setProfissionalSelecionado: (id: number) => void;
}

export default function SelectorProfissionais({
  profissionais,
  profissionalSelecionado,
  setProfissionalSelecionado,
}: SelectorProfissionaisProps) {
  return (
    <div className="mb-6 text-left">
      <h3 className="text-sm font-semibold text-zinc-400 mb-3">Escolha o Profissional</h3>
      <div className="grid grid-cols-2 gap-3">
        {profissionais.map((prof) => {
          const selecionado = prof.id === profissionalSelecionado;
          return (
            <button
              key={prof.id}
              type="button"
              onClick={() => setProfissionalSelecionado(prof.id)}
              className={`p-4 border rounded-xl text-center transition cursor-pointer font-semibold text-sm ${
                selecionado
                  ? "bg-zinc-100 border-white text-black font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {prof.nome}
            </button>
          );
        })}
      </div>
    </div>
  );
}