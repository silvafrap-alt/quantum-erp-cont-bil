import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export type Addon = {
  addonId: string;
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
};

type AddonsState = {
  list: Addon[];
  isLoading: boolean;
  error: string | null;
};

const initialState: AddonsState = {
  list: [],
  isLoading: false,
  error: null,
};

// Buscar addons da empresa
export const fetchAddons = createAsyncThunk(
  "addons/fetchAddons",
  async (companyId: string) => {
    const snapshot = await getDocs(collection(db, `companies/${companyId}/addons`));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Addon));
  }
);

// Atualizar addon (ativar/desativar/configurar)
export const updateAddon = createAsyncThunk(
  "addons/updateAddon",
  async ({
    companyId,
    addonId,
    enabled,
    config,
  }: {
    companyId: string;
    addonId: string;
    enabled: boolean;
    config?: Record<string, any>;
  }) => {
    const ref = doc(db, `companies/${companyId}/addons/${addonId}`);
    await setDoc(ref, { addonId, enabled, config }, { merge: true });
    return { addonId, enabled, config } as Addon;
  }
);

const addonsSlice = createSlice({
  name: "addons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddons.fulfilled, (state, action: PayloadAction<Addon[]>) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchAddons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Erro ao carregar addons";
      })
      .addCase(updateAddon.fulfilled, (state, action: PayloadAction<Addon>) => {
        const idx = state.list.findIndex((a) => a.addonId === action.payload.addonId);
        if (idx >= 0) {
          state.list[idx] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      });
  },
});

export default addonsSlice.reducer;
