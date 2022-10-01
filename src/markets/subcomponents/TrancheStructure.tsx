import { BigNumber } from "bignumber.js";
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

  const payload =
    tranches.length === 3
      ? [
          {
            name: "Senior",
            value: Number(getPercentage(tranches[0]?.target, totalTranchesTarget)),
          },
          {
            name: "Mezzanine",
            value: Number(getPercentage(tranches[1]?.target, totalTranchesTarget)),
          },
          {
            name: "Junior",
            value: Number(getPercentage(tranches[2]?.target, totalTranchesTarget)),
          },
        ]
      : [
          {
            name: "Fixed",
            value: Number(getPercentage(tranches[0]?.target, totalTranchesTarget)),
          },
          {
            name: "Variable",
            value: Number(getPercentage(tranches[1]?.target, totalTranchesTarget)),
          },
        ];

  return (
    <div className={"chart-block tranche-structure" + (wipeRight ? " wipe-right" : "")}>
      <div className="background left-br">
        <h2>Tranche Structure</h2>
        <div className="tranche-chart">
          {payload.map((t, i) => (
            <div key={i} className="tranche-stack" style={{ height: t.value * 2 + "px", background: COLORS[t.name] }}>
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
