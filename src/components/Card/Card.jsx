import styles from "./Card.module.css";

export default function Card({ children, as: Tag = "div", className = "" }) {
  return <Tag className={`${styles.card} ${className}`.trim()}>{children}</Tag>;
}
