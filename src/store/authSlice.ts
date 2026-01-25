import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const auditLancamentos = functions.firestore
  .document("companies/{companyId}/lancamentos/{lancamentoId}")
  .onWrite(async (change, context) => {
    const { companyId, lancamentoId } = context.params;
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;

    let action: "create" | "update" | "delete";
    if (!beforeData && afterData) {
      action = "create";
    } else if (beforeData && afterData) {
      action = "update";
    } else {
      action = "delete";
    }

    const logRef = db
      .collection("companies")
      .doc(companyId)
      .collection("auditLogs")
      .doc();

    await logRef.set({
      action,
      lancamentoId,
      before: beforeData,
      after: afterData,
      userUid: afterData?.userUid || beforeData?.userUid || "unknown",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✔ Audit log registado: ${action} em ${lancamentoId}`);
  });
