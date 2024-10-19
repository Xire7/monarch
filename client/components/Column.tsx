import React from 'react'

interface ColumnProps {
  colName: string;
  colIndex: number;
  rowsInfo: any[];
}

const Column: React.FC<ColumnProps> = ({ colName, colIndex, rowsInfo }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{colName}</th>
        </tr>
      </thead>
      <tbody>
        {rowsInfo.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>{row[colIndex]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Column