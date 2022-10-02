import { BigNumber } from "bignumber.js";
import { useState } from "react";
import { Tranche } from "../../types";

type Props = {
  tranches: Tranche[];
  totalTranchesTarget: string;
  wipeRight: boolean;
};

const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
};

const COLORS: { [key: string]: string } = {
  Senior: "#FCB500",
  Mezzanine: "#00A14A",
  Junior: "#0066FF",
  Fixed: "#FCB500",
  Variable: "#0066FF",
};

function TrancheStructure(props: Props) {
  const { tranches, totalTranchesTarget, wipeRight } = props;

  const [hoveredTranche, setHoveredTranche] = useState<number>(-1);

  const values = [
    Number(getPercentage(tranches[0]?.target, totalTranchesTarget)),
    Number(getPercentage(tranches[1]?.target, totalTranchesTarget)),
    Number(getPercentage(tranches[2]?.target, totalTranchesTarget)),
  ];

  function getSubordination() {
    if (tranches.length === 3) {
      return hoveredTranche === 0 ? values[1] + values[2] : hoveredTranche === 1 ? values[2] : "";
    } else {
      return hoveredTranche === 0 ? values[2] : "";
    }
  }

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
            name: "Variable",
            value: values[1],
          },
        ];

  return (
    <div className={"chart-block tranche-structure" + (wipeRight ? " wipe-right" : "")}>
      <div className="background left-br">
        <h2>Tranche Structure</h2>
        <div className="tranche-chart">
          {hoveredTranche !== -1 && hoveredTranche !== payload.length - 1 ? (
            <span className="subordination" key="subordination">
              Subordination Level (Sum of Lower Tranches):
              <br />
              Total portfolio loss must exceed {getSubordination()}% before principal loss is possible.
            </span>
          ) : null}
          {payload.map((t, i) => (
            <div
              key={i}
              onMouseEnter={() => {
                setHoveredTranche(i);
              }}
              className={"tranche-stack" + (hoveredTranche === i ? " hovered" : "")}
              style={{ height: t.value * 2 + "px", background: COLORS[t.name] }}
            >
              <span>{t.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="background right-br">
        <div className="legend tranche-structure">
          {payload.map((t, i) => (
            <div key={t.name} className="farm-key">
              <div className="key-color" style={{ backgroundColor: COLORS[t.name] }} />
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrancheStructure;
