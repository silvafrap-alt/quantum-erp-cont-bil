import { calcularResumo } from "../utils/financeSummary";

type Lancamento = {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
};

export default function FinancialSummary({ dados }: { dados: Lancamento[] }) {
  const entradas = dados
    .filter((l) => l.tipo === "entrada")
    .reduce((acc, l) => acc + l.valor, 0);

  const saidas = dados
    .filter((l) => l.tipo === "saida")
    .reduce((acc, l) => acc + l.valor, 0);

  const saldo = entradas - saidas;

  return (
    <div>
      <p>Entradas: {entradas} Kz</p>
      <p>Saídas: {saidas} Kz</p>
      <p>Saldo: {saldo} Kz</p>
    </div>
  );
}
