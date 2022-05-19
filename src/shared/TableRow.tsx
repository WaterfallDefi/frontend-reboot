import React from "react";
import { Market } from "../types";

type Props = {
  data: any;
  setSelectedMarket?: React.Dispatch<React.SetStateAction<Market | undefined>>;
};

const TableRow: React.FC<Props> = ({ data, setSelectedMarket }) => {
  const columns = () => {
    const elements = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const columnData = data[key];
        //condition based on key
        const element = <div className="col">{columnData}</div>;
        elements.push(element);
      }
    }
    return elements;
  };

  return (
    <div
      className="table-row"
      onClick={() => {
        setSelectedMarket && setSelectedMarket(data);
      }}
    >
      {columns()}
    </div>
  );
};

export default TableRow;
