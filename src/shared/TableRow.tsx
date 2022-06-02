import numeral from "numeral";
import React, { useState } from "react";
import { Market } from "../types";

type Props = {
  data: any;
  setSelectedMarket?: React.Dispatch<React.SetStateAction<Market | undefined>>;
  openFold?: boolean; //temporary coding to boolean
};

function TableRow(props: Props) {
  const { data, setSelectedMarket, openFold } = props;
  const [foldOpen, setFoldOpen] = useState<boolean>(false);

  const columns = () => {
    const elements = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const columnData = data[key];

        switch (key) {
          case "assets":
            elements.push(
              <div className="col" key={key}>
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
              <div className="col apr" key={key}>
                <div className="tranche-apr">
                  <span>{data[key].length === 2 ? "Fixed" : "Senior"}</span>
                  <div style={{ color: "orange" }}>
                    {numeral(data[key][0]).format("0,0.[00]")} %
                  </div>
                </div>
                <div className="tranche-apr">
                  <span>
                    {data[key].length === 2 ? "Variable" : "Mezzanine"}
                  </span>
                  <div style={{ color: "green" }}>
                    {numeral(data[key][1]).format("0,0.[00]")} %
                  </div>
                </div>
                {data[key].length === 3 ? (
                  <div className="tranche-apr">
                    <span>Junior</span>
                    <div style={{ color: "blue" }}>
                      {numeral(data[key][2]).format("0,0.[00]")} %
                    </div>
                  </div>
                ) : null}
              </div>
            );
            break;
          case "status":
            elements.push(
              <div className="col" key={key}>
                <div className={"status " + columnData}>{columnData}</div>
              </div>
            );
            break;
          default:
            elements.push(
              <div className="col" key={key}>
                {columnData}
              </div>
            );
        }
      }
    }
    return elements;
  };

  return (
    <div className="row-wrapper">
      <div
        className={"table-row" + (foldOpen ? " fold-open" : "")}
        onClick={() => {
          setSelectedMarket && setSelectedMarket(data);
          openFold && setFoldOpen(!foldOpen);
        }}
      >
        {columns()}
      </div>
      {foldOpen ? (
        <div className="fold">
          <div className="wrapper">
            <div className="card">
              <div className="card-title">
                Principal +<u className="est-yield">Est. Yield</u>
              </div>
              <div className="card-value">100.00</div>
              <div className="card-action">
                <button>Redeem</button>
              </div>
              <div className="autoroll-toggle">
                <span>Auto Rolling</span>
                {/* <switch /> */}
              </div>
            </div>
            <div className="card">
              <div className="card-title">WTF Reward</div>
              <div className="card-value">100 WTF</div>
              <div className="card-action">
                <button>Claim</button>
              </div>
            </div>
            <div className="prompt">
              {/* Union */}
              <div>
                <p>
                  After maturity, you can choose to withdraw all the principal +
                  yield. The platform will charge a fee of (principal + all
                  yield in the current period) x
                </p>
                <p>
                  You can also select roll-deposit to the next cycle, and you
                  can change the Tranche and amount during Roll-deposit.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TableRow;
