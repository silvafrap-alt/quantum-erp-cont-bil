import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function AuditLogs({ companyId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("companies")
      .doc(companyId)
      .collection("auditLogs")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

    return () => unsubscribe();
  }, [companyId]);

  return (
    <div>
      <h2>Audit Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            {log.action} - {log.lancamentoId} - {log.userUid}
          </li>
        ))}
      </ul>
    </div>
  );
}
