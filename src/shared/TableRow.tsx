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
                {columnData.map((assetName: string) => [
                  <div
                    key={assetName + "-img"}
                    className="coin"
                    style={{ backgroundImage: `url(/coins/${assetName}.png)` }}
                  />,
                  <span key={assetName + "-span"}>{assetName}</span>,
                ])}
              </div>
            );
            break;
          case "apr":
            elements.push(
              <div className="col apr">
                <div className="tranche-apr">
                  <span>Senior</span>
                  <div style={{ color: "orange" }}>
                    {/* ^ color is temp */}
                    10% APR
                  </div>
                </div>
                <div className="tranche-apr">
                  <span>Mezzanine</span>
                  <div style={{ color: "orange" }}>
                    {/* ^ color is temp */}
                    10% APR
                  </div>
                </div>
                <div className="tranche-apr">
                  <span>Junior</span>
                  <div style={{ color: "orange" }}>
                    {/* ^ color is temp */}
                    10% APR
                  </div>
                </div>
              </div>
            );
            break;
          case "status":
            elements.push(
              <div className="col">
                <div className={"status " + columnData}>{columnData}</div>
              </div>
            );
            break;
          default:
            elements.push(<div className="col">{columnData}</div>);
        }
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
