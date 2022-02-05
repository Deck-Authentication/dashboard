import styles from "./styles.module.scss"

export default function Spinner() {
  return (
    <svg className={styles.spinner}>
      <circle cx="30" cy="30" r="28"></circle>
    </svg>
  )
}
