import { forwardRef } from "react";
import styles from "./Card.module.css";

const Card = forwardRef(function Card(
  { children, as: Tag = "div", className = "" },
  ref
) {
  return (
    <Tag ref={ref} className={`${styles.card} ${className}`.trim()}>
      {children}
    </Tag>
  );
});

export default Card;
