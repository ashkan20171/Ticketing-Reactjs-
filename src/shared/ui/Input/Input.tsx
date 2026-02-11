import styles from "./Input.module.css";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...rest }: Props) {
  return (
    <label className={styles.wrap}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input className={[styles.input, className ?? ""].join(" ")} {...rest} />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
}
