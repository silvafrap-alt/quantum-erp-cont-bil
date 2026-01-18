import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function NovoLancamento() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("Utilizador não autenticado");
      return;
    }

    await addDoc(collection(db, "lancamentos"), {
      userId: user.uid,
      tipo,
      valor: Number(valor),
      descricao,
      data,
      createdAt: Timestamp.now(),
    });

    navigate("/dashboard");
  };

  return (
    <main>
      <h1>Novo Lançamento</h1>
      <form onSubmit={salvar}>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "receita" | "despesa")}
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <input
          type="number"
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
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button type="submit">Guardar</button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}
