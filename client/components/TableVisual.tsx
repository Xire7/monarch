"use client";
import {promises as fs} from 'fs';

interface TableVisualProps {
    cols: string[];
    rows: (string | number | boolean | Date)[][];
}

// const ColumnVisual: React.FC<ColumnVisualProps> = (cols, rows) => {


export default async function TableVisual() {
    console.log(process.cwd() + '../test.json');
    const file = await fs.readFile(process.cwd() + '../test.json', 'utf8');
    const cols = ["name", "age", "school"]
    const rows = [["John", 20, "Harvard"], ["Jane", 21, "MIT"]]

    // const generateTable = (cols: string[], rows: (string | number | boolean | Date)[][]) => {
    //     for (let i = 0; i < cols.length; ++i) {
            
    //     }

    // }
  return (
    <div>
      hello
    </div>
  )
}