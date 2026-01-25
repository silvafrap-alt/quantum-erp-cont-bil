import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

// Sugestão de categorização
export type IASuggestion = {
  lancamentoId: string;
  categoriaSugestao: string;
  score: number; // confiança da sugestão
};

type IAState = {
  suggestions: IASuggestion[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IAState = {
  suggestions: [],
  isLoading: false,
  error: null,
};

// Simulação de chamada IA (Cloud Function)
export const fetchIASuggestion = createAsyncThunk(
  "ia/fetchSuggestion",
  async ({
    companyId,
    lancamentoId,
    descricao,
    valor,
  }: {
    companyId: string;
    lancamentoId: string;
    descricao: string;
    valor: number;
  }) => {
    // Aqui futuramente chamamos uma Cloud Function com IA real
    // Por enquanto, simulamos categorização simples
    let categoria = "Outros";
    if (descricao.toLowerCase().includes("salário")) categoria = "Salários";
    else if (descricao.toLowerCase().includes("compra")) categoria = "Compras";
    else if (valor > 100000) categoria = "Grandes Transações";

    const suggestion: IASuggestion = {
      lancamentoId,
      categoriaSugestao: categoria,
      score: 0.85,
    };

    // Guardar sugestão em Firestore (opcional)
    await setDoc(doc(db, `companies/${companyId}/lancamentos/${lancamentoId}/ia`, "suggestion"), suggestion);

    return suggestion;
  }
);

const iaSlice = createSlice({
  name: "ia",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIASuggestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIASuggestion.fulfilled, (state, action: PayloadAction<IASuggestion>) => {
        state.isLoading = false;
        state.suggestions.push(action.payload);
      })
      .addCase(fetchIASuggestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Erro ao obter sugestão IA";
      });
  },
});

export default iaSlice.reducer;
