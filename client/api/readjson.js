// pages/api/getTableData.ts
import path from "path";
import fs from "fs/promises";

export default async function handler() {
  try {
    console.log(process.cwd() + "client/test.json");
    const fileContents = await fs.readFile(process.cwd() + "client/test.json", "utf8");
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load data" });
  }
}
