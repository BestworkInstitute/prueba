import { useState } from "react";

export default function Home() {
  const [rut, setRut] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Consulta de Google Sheets</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa el RUT"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        />
        <button type="submit">Consultar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div>
          <h2>Resultados:</h2>
          <ul>
            {data.map((row, index) => (
              <li key={index}>{row.join(" | ")}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
