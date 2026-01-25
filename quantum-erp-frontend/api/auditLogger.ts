import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { companyId, lancamentoId, action, before, after, userUid } = req.body;

    await db.collection("companies")
      .doc(companyId)
      .collection("auditLogs")
      .add({
        action,
        lancamentoId,
        before,
        after,
        userUid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
    res.status(500).json({ error: "Erro ao registrar log" });
  }
}
