import React from "react";
import { Market } from "../types";

type Props = {
  data: any;
  setSelectedMarket?: React.Dispatch<React.SetStateAction<Market | undefined>>;
};

const TableRow: React.FC<Props> = ({ data, setSelectedMarket }) => {
  const cols = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key];
      cols.push(element);
    }
  }
  return (
    <div
      className="table-row"
      onClick={() => {
        setSelectedMarket && setSelectedMarket(data);
      }}
    >
      {cols.map((c) => (
        <div className="col">{c}</div>
      ))}
    </div>
  );
};

export default TableRow;
