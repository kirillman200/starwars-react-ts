// src/services/api.ts
const BASE_URL = "https://sw-api.starnavi.io";

export const fetchHeroes = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/people/?page=${page}`, {
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch heroes");
  }

  return response.json();
};

export const fetchHeroDetails = async (id: number) => {
  const response = await fetch(`${BASE_URL}/people/${id}?format=json`, {
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch hero details");
  }
  return response.json();
};

export const fetchFilmDetails = async (filmId: number) => {
  const response = await fetch(`${BASE_URL}/films/${filmId}/?format=json`, {
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch film details");
  }
  return response.json();
};

export const fetchStarshipDetails = async (starshipId: number) => {
  const response = await fetch(`${BASE_URL}/starships/${starshipId}/?format=json`, {
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch starship details");
  }
  return response.json();
};
