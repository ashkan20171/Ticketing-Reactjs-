import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../shared/ui/Card/Card";
import { Input } from "../shared/ui/Input/Input";
import { Button } from "../shared/ui/Button/Button";
import { login } from "../features/auth/model/auth";
import { useLogs } from "../app/providers/LogsProvider";
import { useToast } from "../app/providers/ToastProvider";

export function LoginPage() {
  const { addLog } = useLogs();
  const { toast } = useToast();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setError("");
      await login(email, password);

      addLog({
        action: "LOGIN",
        message: `Login success for ${email}`,
        actorEmail: email
      });

      toast({
        type: "success",
        title: "ورود موفق",
        message: "خوش آمدید"
      });

      nav("/", { replace: true });

    } catch (e: any) {
      setError(e.message);

      addLog({
        level: "error",
        action: "LOGIN_FAILED",
        message: `Login failed for ${email}: ${e.message}`,
        actorEmail: email
      });

      toast({
        type: "error",
        title: "خطا در ورود",
        message: e.message
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20
      }}
    >
      <Card>
        <div style={{ display: "grid", gap: 16, width: 300 }}>
          <h2 style={{ textAlign: "center" }}>ورود به سیستم</h2>

          {error && (
            <div style={{ color: "#ff6b6b", fontSize: 13 }}>
              {error}
            </div>
          )}

          <Input
            label="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={submit}>
            ورود
          </Button>
        </div>
      </Card>
    </div>
  );
}
