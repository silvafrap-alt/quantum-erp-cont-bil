import { useState } from "react";
import { db } from "../firebase";
import { useAppSelector } from "../store";
import { canCreateLancamento } from "../store/dashboardSlice";

export default function Lancamentos({ companyId, currentUser }) {
  const canCreate = useAppSelector(canCreateLancamento);
  const [novoLancamento, setNovoLancamento] = useState({ descricao: "", valor: 0 });

  // Criar
  const handleCreateLancamento = async () => {
    const docRef = await db.collection("companies")
      .doc(companyId)
      .collection("lancamentos")
      .add(novoLancamento);

    await fetch("/api/auditLogger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        lancamentoId: docRef.id,
        action: "create",
        before: null,
        after: novoLancamento,
        userUid: currentUser.uid,
      }),
    });
  };

  // Atualizar
  const handleUpdateLancamento = async (lancamentoId, dadosAtualizados, dadosAntigos) => {
    await db.collection("companies")
      .doc(companyId)
      .collection("lancamentos")
      .doc(lancamentoId)
      .update(dadosAtualizados);

    await fetch("/api/auditLogger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        lancamentoId,
        action: "update",
        before: dadosAntigos,
        after: dadosAtualizados,
        userUid: currentUser.uid,
      }),
    });
  };

  // Apagar
  const handleDeleteLancamento = async (lancamentoId, dadosAntigos) => {
    await db.collection("companies")
      .doc(companyId)
      .collection("lancamentos")
      .doc(lancamentoId)
      .delete();

    await fetch("/api/auditLogger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        lancamentoId,
        action: "delete",
        before: dadosAntigos,
        after: null,
        userUid: currentUser.uid,
      }),
    });
  };

  if (!canCreate) {
    return <p>Limite do plano atingido. Faça upgrade.</p>;
  }

  return (
    <div>
      <h2>Lançamentos</h2>
      <input
        type="text"
        placeholder="Descrição"
        value={novoLancamento.descricao}
        onChange={(e) => setNovoLancamento({ ...novoLancamento, descricao: e.target.value })}
      />
      <input
        type="number"
        placeholder="Valor"
        value={novoLancamento.valor}
        onChange={(e) => setNovoLancamento({ ...novoLancamento, valor: Number(e.target.value) })}
      />
      <button onClick={handleCreateLancamento}>Criar lançamento</button>
    </div>
  );
}
