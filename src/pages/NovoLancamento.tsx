import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function NovoLancamento() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "lancamentos"), {
      userId: user.uid,
      tipo,
      valor: Number(valor),
      descricao,
      data,
      createdAt: serverTimestamp(),
    });

    navigate("/dashboard");
  };

  return (
    <main style={{ padding: 20 }}>
      <h2>Novo Lançamento</h2>

      <form onSubmit={handleSubmit}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button type="submit">Guardar</button>
      </form>
    </main>
  );
}
