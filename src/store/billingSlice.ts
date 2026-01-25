import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Plan = {
  planId: string;
  name: string;
  tier: "free" | "pro" | "enterprise";
  limits: {
    maxLancamentos?: number;
    maxUsers?: number;
  };
};

type BillingState = {
  plan: Plan | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: BillingState = {
  plan: null,
  isLoading: false,
  error: null,
};

// Buscar plano da empresa
export const fetchPlan = createAsyncThunk(
  "billing/fetchPlan",
  async (companyId: string) => {
    const ref = doc(db, `companies/${companyId}/plans/default`);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data() as Plan;
    }
    // Se não existir, cria plano free por defeito
    const defaultPlan: Plan = {
      planId: "default",
      name: "Free",
      tier: "free",
      limits: { maxLancamentos: 100, maxUsers: 1 },
    };
    await setDoc(ref, defaultPlan);
    return defaultPlan;
  }
);

// Atualizar plano
export const setPlan = createAsyncThunk(
  "billing/setPlan",
  async ({ companyId, plan }: { companyId: string; plan: Plan }) => {
    const ref = doc(db, `companies/${companyId}/plans/default`);
    await setDoc(ref, plan);
    return plan;
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.isLoading = false;
        state.plan = action.payload;
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Erro ao carregar plano";
      })
      .addCase(setPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.plan = action.payload;
      });
  },
});

export default billingSlice.reducer;
