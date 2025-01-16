import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo se permiten solicitudes POST." });
  }

  const { rut } = req.body;

  if (!rut || typeof rut !== "string") {
    return res.status(400).json({ error: "RUT inválido o no proporcionado." });
  }

  try {
    // Leer las credenciales desde las variables de entorno
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:E", // Ajusta el rango según tus columnas
    });

    const rows = response.data.values;

    const matchingRows = rows.filter((row) => row[1] === rut);

    if (matchingRows.length === 0) {
      return res.status(404).json({ error: `No se encontraron datos para el RUT: ${rut}` });
    }

    return res.status(200).json({ data: matchingRows });
  } catch (error) {
    console.error("Error al consultar Google Sheets:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
