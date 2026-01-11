import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Pagamento confirmado</h2>
      <p>Estamos a preparar o seu acesso…</p>
    </div>
  );
}
