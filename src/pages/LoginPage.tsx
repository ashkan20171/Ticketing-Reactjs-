import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../shared/ui/Card/Card";
import { Input } from "../shared/ui/Input/Input";
import { Button } from "../shared/ui/Button/Button";
import { login } from "../features/auth/model/auth";

export function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setError("");
      await login(email, password);
      nav("/", { replace: true });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"grid", placeItems:"center", padding:20 }}>
      <Card>
        <div style={{ display:"grid", gap:12 }}>
          <h2>ورود به سیستم</h2>
          {error && <div style={{ color:"red", fontSize:13 }}>{error}</div>}
          <Input label="ایمیل" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input label="رمز عبور" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button onClick={submit}>ورود</Button>
        </div>
      </Card>
    </div>
  );
}
