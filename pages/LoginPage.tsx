function LoginPage() {
  const { login } = useAuth(); // vem do AuthContext
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login("silvafrap@gmail.com", "SUA_PASSWORD_AQUI");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div>
      <h1>LOGIN PAGE</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
