"use client";
// pages/index.tsx
import { useEffect, useState } from "react";
import { fetchHeroes } from "@/app/services/api";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";

interface Hero {
  id: number;
  name: string;
}

const StarWarsList: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setLoading(true);
        const data = await fetchHeroes(page);
        setHeroes((prev) => [...prev, ...data.results]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        console.log("finally");
      }
    };

    loadHeroes();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <div>
      <h1>Star Wars Heroes</h1>
      <ul className={styles.characters}>
        {heroes.map((hero) => (
          <li className={styles.card} key={hero.id}>
            <Link href={`/hero/${hero.id}`}>
              <p>{hero.name}</p>
              <Image
                src={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`}
                alt={hero.name}
                width={200}
                height={200}
              />
            </Link>
          </li>
        ))}
      </ul>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
};

export default StarWarsList;
