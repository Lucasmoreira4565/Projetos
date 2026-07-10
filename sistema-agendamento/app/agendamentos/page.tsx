import { createClient } from "@/supabase/lib/supabase/server"; // Ajuste o caminho se necessário
import { Suspense } from "react";

async function AgendamentosData() {
  // TESTE SE AS VARIÁVEIS ESTÃO CHEGANDO:
  console.log("URL DO BANCO:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("CHAVE DO BANCO:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = await createClient();
  const { data: agendamentos, error } = await supabase.from("agendamento").select();

  if (error) {
    return <div className="text-red-500">Erro: {error.message}</div>;
  }

  return <pre className="text-left bg-zinc-900 p-4 rounded-xl">{JSON.stringify(agendamentos, null, 2)}</pre>;
}

export default function AgendamentosPage() {
  return (
    <div className="p-8 text-zinc-100 bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Lista de Agendamentos</h1>
      <Suspense fallback={<div>Carregando...</div>}>
        <AgendamentosData />
      </Suspense>
    </div>
  );
}