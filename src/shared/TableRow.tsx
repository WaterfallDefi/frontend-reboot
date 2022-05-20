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

        switch (key) {
          case "assets":
            elements.push(
              <div className="col">
                {columnData.map((assetName: string) => (
                  <div
                    className="coin"
                    style={{ backgroundImage: `url(/coins/${assetName}.png)` }}
                  />
                ))}
              </div>
            );
        }

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
