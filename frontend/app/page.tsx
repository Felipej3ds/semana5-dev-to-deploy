"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  getDocs,
} from "firebase/firestore";

type DataResponse = {
  status: string;
  items: string[];
};

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || "api";
const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_EMULATOR === "true";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/health/";

async function fetchFromApi(): Promise<DataResponse> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("bad response");
  return res.json();
}

async function fetchFromFirestore(): Promise<DataResponse> {
  const app =
    getApps()[0] ??
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-semana6",
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
    });
  const db = getFirestore(app);
  if (USE_EMULATOR) {
    try {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    } catch {
      // já conectado (hot reload)
    }
  }
  const snap = await getDocs(collection(db, "items"));
  const items = snap.docs
    .map((d) => d.data())
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((d) => String(d.nome));
  return { status: "ok", items };
}

export default function Home() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = DATA_SOURCE === "firestore" ? fetchFromFirestore : fetchFromApi;
    load()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      {loading && <p>Carregando...</p>}

      {error && (
        <div>
          <h1>Dados indisponíveis</h1>
          <p>
            O backend não está acessível no momento. Tente novamente mais tarde.
          </p>
        </div>
      )}

      {data && (
        <>
          <h1>Status (Versão B): {data.status}</h1>
          <ul>
            {data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}