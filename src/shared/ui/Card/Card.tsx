import styles from "./Card.module.css";
type Props = React.PropsWithChildren<{ className?: string }>;
export function Card({ className, children }: Props) {
  return <div className={[styles.card, className ?? ""].join(" ")}>{children}</div>;
}
