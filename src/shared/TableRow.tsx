// import dayjs from "dayjs";
import numeral from "numeral";
import { useState } from "react";
import Countdown from "react-countdown";
// import Tooltip from "./svgs/Tooltip";

// const COLORS: { [key: string]: string } = {
//   Senior: "#FCB500",
//   Mezzanine: "#00A14A",
//   Junior: "#0066FF",
//   Fixed: "#FCB500",
//   Variable: "#0066FF",
// };

type Props = {
  data: any;
  pointer: boolean;
  setSelectedMarket?: () => void;
  foldElement?: JSX.Element;
};

// const formatTimestamp = (num: string | number) => {
//   const format1 = "YYYY/MM/DD HH:mm:ss";
//   const d = parseInt(num + "000");
//   return dayjs(d).format(format1);
// };

function TableRow(props: Props) {
  const { data, pointer, setSelectedMarket, foldElement } = props;
  const [foldOpen, setFoldOpen] = useState<boolean>(false);
  // const [hoverTooltip, setHoverTooltip] = useState<boolean>(false);

  const columns = () => {
    const elements = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const columnData = data[key];

        switch (key) {
          case "portfolio":
            elements.push(
              <div className="col portfolio-name" key={key}>
                <span className="mob-title">Portfolio Name</span>
                <span>{columnData}</span>
              </div>
            );
            break;
          case "network":
            elements.push(
              <div className={"col network " + columnData} key={key}>
                <span className="mob-title">Network</span>
                <span>{columnData}</span>
              </div>
            );
            break;
          case "assets":
            elements.push(
              <div className="col" key={key}>
                <span className="mob-title">Assets</span>
                <div className="assets">
                  {columnData.map((assetName: string) => [
                    <div
                      key={assetName + "-img"}
                      className="coin"
                      style={{ backgroundImage: `url(/coins/${assetName}.png)` }}
                    />,
                    <span key={assetName + "-span"}>{assetName}</span>,
                  ])}
                </div>
              </div>
            );
            break;
          case "apr_markets":
            elements.push(
              <div className="col apr_markets" key={key}>
                <div className="tranche-apr">
                  <span>{columnData.tranchesApr.length === 2 ? "Fixed Vault" : "Senior"}</span>
                  <div>
                    <span
                      style={{
                        color: "rgba(252, 182, 4, 0.8)",
                      }}
                    >
                      {numeral(columnData.tranchesApr[0]).format("0,0.[00]")} %
                    </span>
                  </div>
                </div>
                <div className="tranche-apr">
                  <span>{columnData.tranchesApr.length === 2 ? "Degen Vault" : "Mezzanine"}</span>
                  <div>
                    <span
                      style={{
                        color: "rgb(80, 144, 234)",
                      }}
                    >
                      {numeral(columnData.tranchesApr[1]).format("0,0.[00]")} %
                    </span>
                  </div>
                </div>
                {columnData.tranchesApr.length === 3 ? (
                  <div className="tranche-apr">
                    <span>Junior</span>
                    <div>
                      <span
                        style={{
                          color: "#76bb68",
                        }}
                      >
                        {numeral(columnData.tranchesApr[2]).format("0,0.[00]")} %
                      </span>
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
          // case "yield":
          //   if (typeof columnData.yield === "object") {
          //     elements.push(
          //       <div className="col yield" key={key}>
          //         <span className="mob-title">Yield</span>
          //         {columnData.yield.map((y: any, i: number) => (
          //           <div className="mc-yield" key={i}>
          //             <span>{y}</span>
          //             <div
          //               key={columnData.assets[i] + "-img"}
          //               className="coin"
          //               style={{ backgroundImage: `url(/coins/${columnData.assets[i]}.png)` }}
          //             />
          //             <span key={columnData.assets[i] + "-span"}>{columnData.assets[i]}</span>
          //           </div>
          //         ))}
          //       </div>
          //     );
          //   } else {
          //     elements.push(
          //       <div className="col yield" key={key}>
          //         <span className="mob-title">Yield</span>
          //         <span>{columnData.yield}</span>
          //       </div>
          //     );
          //   }
          //   break;
          // case "principal":
          //   if (columnData.assets.length > 1) {
          //     elements.push(
          //       <div className="col principal" key={key}>
          //         <span className="mob-title">Principal</span>
          //         {columnData.MCprincipal.map((p: any, i: number) => (
          //           <div className="mc-principal" key={i}>
          //             <span>{p}</span>
          //             <div
          //               key={columnData.assets[i] + "-img"}
          //               className="coin"
          //               style={{ backgroundImage: `url(/coins/${columnData.assets[i]}.png)` }}
          //             />
          //             <span key={columnData.assets[i] + "-span"}>{columnData.assets[i]}</span>
          //           </div>
          //         ))}
          //       </div>
          //     );
          //   } else {
          //     elements.push(
          //       <div className="col principal" key={key}>
          //         <span className="mob-title">Principal</span>
          //         <span>{columnData.principal + " " + columnData.assets[0]}</span>
          //       </div>
          //     );
          //   }
          //   break;
          case "nextCycle":
            elements.push(
              <div className="col" key={key}>
                <Countdown
                  date={columnData * 1000}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    return (
                      <span>
                        {!completed && (
                          <>
                            {hours}H {minutes}M {seconds}S
                          </>
                        )}
                      </span>
                    );
                  }}
                />
              </div>
            );
            break;
          case "tranche":
            elements.push(
              <div className={"col " + columnData} key={key}>
                {columnData}
              </div>
            );
            break;
          default:
            elements.push(
              <div className="col" key={key}>
                <span className="mob-title">{key === "duration" ? "Lock-up Period" : "TVL"}</span>
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
        className={"table-row" + (pointer ? " pointer" : "") + (foldOpen ? " fold-open" : "")}
        onClick={() => {
          //markets on click
          setSelectedMarket && setSelectedMarket();
          //my portfolio on click
          foldElement && setFoldOpen(!foldOpen);
        }}
      >
        {columns()}
      </div>
      {foldOpen ? foldElement : null}
    </div>
  );
}

export default TableRow;
