import Image from "next/image";

export default function BannerHeader() {
  return (
    <>
      <div className="w-full h-32 sm:h-48 relative overflow-hidden rounded-2xl mb-6">
        <Image
          src="/banner.jpg"
          alt="Banner da Empresa"
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-row items-center justify-center gap-4 mb-3 w-full">
        <Image
          src="/logo.png"
          alt="Logo da Empresa"
          width={80}
          height={80}
          style={{ width: 'auto !important', height: 'auto !important' }}
          className="rounded-xl object-cover"
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
          Moreira's Barber
        </h1>
      </div>
      
      <p className="text-base text-gray-400 max-w-xl">
        Escolha o melhor dia e horário para o seu atendimento.
      </p>
    </>
  );
}