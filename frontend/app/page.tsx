async function getHealth() {
  const res = await fetch('http://localhost:8000/api/health/', { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  const data = await getHealth();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Status: {data.status}</h1>
      <ul>
        {data.items.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </main>
  );
}