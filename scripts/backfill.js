const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function runBackfill() {
  const companiesSnapshot = await db.collection("companies").get();

  console.log(`🔍 Empresas encontradas: ${companiesSnapshot.size}`);

  for (const companyDoc of companiesSnapshot.docs) {
    const companyId = companyDoc.id;
    const companyData = companyDoc.data();

    console.log(`\n🏢 Processando empresa: ${companyId} (${companyData.name})`);

    const ownerUid = companyData.ownerUid;
    if (!ownerUid) {
      console.log("⚠️ Empresa sem ownerUid definido. Ignorada.");
      continue;
    }

    // 1. Membro owner
    const memberRef = db.doc(`companies/${companyId}/members/${ownerUid}`);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) {
      await memberRef.set({ uid: ownerUid, role: "owner" });
      console.log(`✔ Membro criado: ${ownerUid} como owner`);
    } else {
      console.log(`ℹ️ Membro já existe: ${ownerUid}`);
    }

    // 2. Plano default
    const planRef = db.doc(`companies/${companyId}/plans/default`);
    const planSnap = await planRef.get();
    if (!planSnap.exists) {
      await planRef.set({
        planId: "default",
        name: "Free",
        tier: "free",
        limits: { maxLancamentos: 100, maxUsers: 1 },
        createdAt: new Date().toISOString(),
      });
      console.log("✔ Plano Free criado");
    } else {
      console.log("ℹ️ Plano já existe");
    }

    // 3. Addons
    const addons = ["iaAssistant", "auditTrail"];
    for (const addonId of addons) {
      const addonRef = db.doc(`companies/${companyId}/addons/${addonId}`);
      const addonSnap = await addonRef.get();
      if (!addonSnap.exists) {
        await addonRef.set({
          addonId,
          name: addonId,
          enabled: false,
          createdAt: new Date().toISOString(),
        });
        console.log(`✔ Addon ${addonId} criado desativado`);
      } else {
        console.log(`ℹ️ Addon ${addonId} já existe`);
      }
    }
  }

  console.log("\n🎯 Backfill concluído!");
}

runBackfill().catch((err) => {
  console.error("❌ Erro no backfill:", err);
});
