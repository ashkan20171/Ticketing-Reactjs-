import { useMemo, useState } from "react";
import { Modal } from "../../../shared/ui/Modal/Modal";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/Button/Button";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { Ticket, TicketPriority, TicketStatus } from "../../../shared/types/ticket";
import { getUser } from "../../../features/auth/model/auth";
import { useToast } from "../../../app/providers/ToastProvider";
import { useLogs } from "../../../app/providers/LogsProvider";
import { useI18n } from "../../../app/providers/I18nProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ticket: Ticket) => void;
};

type Form = {
  title: string;
  department: Ticket["department"];
  priority: TicketPriority;
  description: string;
};

type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form, t: (x: string) => string): Errors {
  const e: Errors = {};
  if (!f.title.trim()) e.title = t("عنوان اجباری است.");
  else if (f.title.trim().length < 5) e.title = t("عنوان باید حداقل ۵ کاراکتر باشد.");

  if (!f.description.trim()) e.description = t("توضیحات اجباری است.");
  else if (f.description.trim().length < 10) e.description = t("توضیحات باید حداقل ۱۰ کاراکتر باشد.");

  return e;
}

export function CreateTicketModal({ isOpen, onClose, onCreate }: Props) {
  const user = getUser();
  const { toast } = useToast();
  const { addLog } = useLogs();
  const { t, dir } = useI18n();
  const [form, setForm] = useState<Form>({
    title: "",
    department: "فنی",
    priority: "normal",
    description: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const canSubmit = useMemo(() => Object.keys(validate(form, t)).length === 0, [form, t]);

  const submit = () => {
    const e = validate(form, t);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: form.title.trim(),
      department: form.department,
      status: "open" as TicketStatus,
      priority: form.priority,
      createdAt: now,
      updatedAt: now,
      requesterEmail: user?.email ?? "unknown@example.com",
      messages: [
        {
          id: `m-${Date.now()}`,
          author: "user",
          text: form.description.trim(),
          createdAt: now,
        },
      ],
    };

    onCreate(ticket);
    toast({ type: "success", title: t("تیکت ثبت شد"), message: t("تیکت جدید با موفقیت اضافه شد.") });
    addLog({ action: "CREATE_TICKET", message: `Ticket ${ticket.id} created`, actorEmail: user?.email });
    onClose();
    setForm({ title: "", department: "فنی", priority: "normal", description: "" });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("ایجاد تیکت جدید")}>
      <div dir={dir} style={{ display: "grid", gap: 12 }}>
        <Input
          label={t("عنوان")}
          placeholder={t("مثلاً: مشکل ورود به پنل")}
          value={form.title}
          error={errors.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{t("دپارتمان")}</span>
            <select
              value={form.department}
              onChange={(e) => setForm((p) => ({ ...p, department: e.target.value as Form["department"] }))}
              style={{
                padding: 10,
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text)",
                outline: "none",
              }}
            >
              <option value="فنی">{t("فنی")}</option>
              <option value="مالی">{t("مالی")}</option>
              <option value="فروش">{t("فروش")}</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{t("اولویت")}</span>
            <select
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as TicketPriority }))}
              style={{
                padding: 10,
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text)",
                outline: "none",
              }}
            >
              <option value="low">{t("کم")}</option>
              <option value="normal">{t("عادی")}</option>
              <option value="high">{t("بالا")}</option>
              <option value="urgent">{t("فوری")}</option>
            </select>
          </label>
        </div>

        <Textarea
          label={t("توضیحات")}
          placeholder={t("توضیح کامل مشکل یا درخواست...")}
          value={form.description}
          error={errors.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
          <Button variant="secondary" onClick={onClose}>
            انصراف
          </Button>
          <Button disabled={!canSubmit} onClick={submit}>
            ثبت تیکت
          </Button>
        </div>
      </div>
    </Modal>
  );
}
