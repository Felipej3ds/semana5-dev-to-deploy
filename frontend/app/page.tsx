"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  items: string[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/health/";

export default function Home() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((json: HealthResponse) => setData(json))
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
          <h1>Status: {data.status}</h1>
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