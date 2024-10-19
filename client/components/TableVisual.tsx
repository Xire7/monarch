"use client";
import React from 'react';
import Column from './Column';

interface Dataset {
  name: string;
  cols: string[];
  rows: (string | number | boolean | Date)[][];
}

const testData: Dataset[] = [
  {  
    name: "dataset1",
    cols: ["name", "age", "major", "school"],
    rows: [
      ["Greg", 20, "CS", "UCSD"],
      ["Pranay", 21, "Math", "UCLA"],
      ["Sushanth", 22, "EE", "UCB"]
    ]
  },
  {  
    name: "dataset2",
    cols: ["name", "age", "major", "school"],
    rows: [
      ["Caleb", 20, "CS", "UCSD"],
      ["BibbleDibble", 21, "Math", "UCLA"],
      ["Anne", 22, "EE", "UCB"]
    ]
  }
];

const TableVisual: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {testData.map((dataset, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h1>{dataset.name}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {dataset.cols.map((col, colIndex) => (
              <Column 
                key={colIndex} 
                colName={col} 
                colIndex={colIndex} 
                rowsInfo={dataset.rows} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableVisual;