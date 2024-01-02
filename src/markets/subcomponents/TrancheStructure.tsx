// import { BigNumber } from "bignumber.js";
import numeral from "numeral";
import { useState } from "react";
import { Tranche } from "../../types";

type Props = {
  tranches: Tranche[];
  totalTranchesTarget: string;
  toggleChartTranche: number;
  setToggleChartTranche: React.Dispatch<React.SetStateAction<number>>;
};

// const getPercentage = (num: string | undefined, total: string | undefined) => {
//   if (!num || !total) return "0";
//   return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
// };

// const COLORS: { [key: string]: string } = {
//   Senior: "#FCB500",
//   Mezzanine: "#00A14A",
//   Junior: "#0066FF",
//   RiskOff: "#FCB500",
//   RiskOn: "rgb(80, 144, 234)",
// };

function TrancheStructure(props: Props) {
  const {
    tranches,
    // totalTranchesTarget,
    toggleChartTranche,
    setToggleChartTranche,
  } = props;

  const [hoveredTranche, setHoveredTranche] = useState<number>(-1);

  const sum = Number(tranches[0]?.autoPrincipal) + Number(tranches[1]?.autoPrincipal);

  const values = [
    Number(tranches[0]?.autoPrincipal) / Number(sum),
    Number(tranches[1]?.autoPrincipal) / Number(sum),
    Number(tranches[2]?.autoPrincipal) / Number(sum), //we may never need this
  ];

  //we need to figure out how to calculate subordination

  // function getSubordination() {
  //   if (tranches.length === 3) {
  //     return hoveredTranche === 0 ? values[1] + values[2] : hoveredTranche === 1 ? values[2] : "";
  //   } else {
  //     return hoveredTranche === 0 ? Number(getPercentage(tranches[1]?.target, totalTranchesTarget)) : "";
  //   }
  // }

  const payload =
    tranches.length === 3
      ? [
          {
            name: "Senior",
            value: values[0],
          },
          {
            name: "Mezzanine",
            value: values[1],
          },
          {
            name: "Junior",
            value: values[2],
          },
        ]
      : [
          {
            name: "Fixed",
            value: values[0],
          },
          {
            name: "Degen",
            value: values[1],
          },
        ];

  return (
    <div className={"chart-block tranche-structure"}>
      <div className="background left-br right-br">
        <h3>Tranche Structure (Dynamic)</h3>
        <div className="tranche-chart">
          {hoveredTranche !== -1 ? (
            <div className="subordination" key="subordination">
              <span className={"tranche-name " + payload[hoveredTranche].name.toLowerCase()}>
                {payload[hoveredTranche].name}
              </span>
              <br />
              {/* {hoveredTranche !== payload.length - 1 && (
                <span className="label">Subordination Level (Sum of Lower Tranches):</span>
              )} */}
              {/* {hoveredTranche === payload.length - 1 && <span className="label">Variable Rate:</span>}
              <br /> */}
              {hoveredTranche === 0 && (
                <span className="comment">
                  Repayment of Interest and Principal is paid out to the Fixed segment first.
                  {/* {payload[hoveredTranche].name}{" "} */}
                  {/* Tranche users have principal protection until the portfolio strategy experiences{" "}
                  {numeral(getSubordination().toString()).format("0,0.[0000]")}% loss or more. */}
                </span>
              )}
              {hoveredTranche === 1 && hoveredTranche !== payload.length - 1 && (
                <span className="comment">
                  Degen tranche receives all the residual return, after paying back the Fixed tranche. Degen tranche is
                  subject to first loss should the portfolio experience any drawdowns.
                  {/* Mezzanine Tranche
                  Repayment of Interest and Principal is paid after Senior Tranche.
                  Mezzanine users have principal protection until the portfolio strategy experiences{" "}
                  {numeral(getSubordination().toString()).format("0,0.[0000]")}% loss or more. */}
                </span>
              )}
              {hoveredTranche === payload.length - 1 && (
                <span className="comment">
                  Degen tranche receives all the residual return, after paying back Fixed tranche. Degen tranches are
                  subject to first loss should the portfolio experience any drawdowns.
                </span>
              )}
            </div>
          ) : null}
          {payload.map((t, i) => (
            <div
              key={i}
              onMouseEnter={() => {
                setHoveredTranche(i);
              }}
              onMouseLeave={() => {
                setHoveredTranche(-1);
              }}
              onClick={() => {
                setToggleChartTranche(i);
              }}
              className={
                "tranche-stack" +
                (hoveredTranche === i || toggleChartTranche === i ? " hovered " : " ") +
                t.name.toLowerCase()
              }
              style={{ height: t.value * 125 + "px" }}
            >
              <span>{numeral(t.value * 100).format("0,0")}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrancheStructure;
