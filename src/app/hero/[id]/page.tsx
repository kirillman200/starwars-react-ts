"use client";
// pages/hero/[id].tsx

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "../../page.module.css";

import {
  fetchFilmDetails,
  fetchStarshipDetails,
  fetchHeroDetails,
} from "@/app/services/api";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import Link from "next/link";

import type { Node, Edge } from "@xyflow/react";

type Film = {
  id: number;
  title: string;
};

type Starship = {
  id: number;
  name: string;
};

type Hero = {
  id: number;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  home_world: number;
  films: Film[];
  starships: Starship[];
};

export default function HeroDetails() {
  const [hero, setHero] = useState<Hero | null>(null);
  const router = usePathname().split("/").pop();
  const id = parseInt(router);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const effectRan = useRef(false);
  const calculatePosition = (
    centerX: number,
    index: number,
    offsetX: number,
    baseY: number = 250
  ) => ({
    x: centerX + offsetX,
    y: baseY + index * 100,
  });
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    const fetchData = async () => {
      try {
        const heroData = await fetchHeroDetails(id);
        const filmPromises = heroData?.films.map((filmId: number) =>
          fetchFilmDetails(filmId)
        );

        const starshipPromises = heroData?.starships.map((starshipId: number) =>
          fetchStarshipDetails(starshipId)
        );
        const films = await Promise.all(filmPromises);
        const starships = await Promise.all(starshipPromises);

        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        const centerX = containerWidth / 2;

        const heroNode = {
          id: `hero-${heroData.id}`,
          data: { label: heroData.name },
          position: { x: centerX - 100, y: 100 },
          dragging: true,
        };
        const filmNodes = films.map((film, index) => ({
          id: `film-${film.id}`,
          data: { label: film.title },
          position: calculatePosition(centerX, index, -150),
        }));
        const starshipNodes = starships.map((starship, index) => ({
          id: `starship-${starship.id}`,
          data: { label: starship.name },
          position: calculatePosition(centerX, index, 150),
        }));

        const filmEdges = films.map((film) => ({
          id: `e-hero-film-${film.id}`,
          source: `hero-${heroData.id}`,
          target: `film-${film.id}`,
          type: "default",
        }));
        const starshipEdges = starships.map((starship) => ({
          id: `e-film-starship-${starship.id}`,
          source: `film-${films[0].id}`,
          target: `starship-${starship.id}`,
          type: "default",
          animated: true,
        }));

        setNodes([heroNode, ...filmNodes, ...starshipNodes]);
        setEdges([...filmEdges, ...starshipEdges]);
        setHero(heroData);
      } catch (error) {
        console.log(error);
        setError("Failed to load hero details: " + error);
      }
    };

    fetchData();
  }, [id]);

  if (!hero) {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <button className={styles.backBtn}>
        <Link href='/'>Back</Link>
      </button>
      <div className={styles.heropage}>
        <h1 className={styles.heroname}>{hero.name}</h1>
        <Image
          src={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`}
          alt={hero.name}
          width={200}
          height={200}
          className={styles.heroimage}
        />
        <div className={styles.reactFlow} style={{ height: "70vh", color: "#000" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
