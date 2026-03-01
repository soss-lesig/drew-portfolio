import { forwardRef } from "react";
import styles from "./Card.module.css";

const Card = forwardRef(function Card(
  { children, as: Tag = "div", className = "", style },
  ref
) {
  return (
    <Tag ref={ref} className={`${styles.card} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
});

export default Card;
