const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function test() {
  const snapshot = await db.collection("companies").limit(1).get();
  console.log("Firestore conectado. Empresas encontradas:", snapshot.size);
}

test().catch((err) => {
  console.error("Erro ao conectar com Firestore:", err);
});
