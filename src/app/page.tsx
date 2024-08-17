import styles from "./page.module.css";
import StarWars from "@/app/components/StarWarsList";

export default async function Home() {
  return (
    <main className={styles.main}>
      {" "}
      <StarWars />
    </main>
  );
}
