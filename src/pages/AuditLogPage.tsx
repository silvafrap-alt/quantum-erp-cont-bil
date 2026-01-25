import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAuditLogs } from "../store/auditSlice";

export default function AuditLogPage() {
  const dispatch = useAppDispatch();
  const { activeId } = useAppSelector((s) => s.companies);
  const { logs, isLoading, error } = useAppSelector((s) => s.audit);

  useEffect(() => {
    if (activeId) {
      dispatch(fetchAuditLogs(activeId));
    }
  }, [dispatch, activeId]);

  if (!activeId) return <p>Selecione uma empresa primeiro.</p>;
  if (isLoading) return <p>Carregando logs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Auditoria</h2>
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Utilizador</th>
            <th>Ação</th>
            <th>Entidade</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.actorUid}</td>
              <td>{log.action}</td>
              <td>{log.entity}</td>
              <td>{log.entityId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
