import { BigNumber } from "bignumber.js";
import { VictoryBar, VictoryPie, VictoryStack } from "victory";
import { Tranche } from "../../types";

type Props = {
  tranches: Tranche[];
  totalTranchesTarget: string;
};

const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num)
    .dividedBy(new BigNumber(total))
    .times(100)
    .toFormat(2)
    .toString();
};

const COLORS: { [key: string]: string } = {
  Senior: "#FCB500",
  Mezzanine: "#00A14A",
  Junior: "#0066FF",
  Fixed: "#FCB500",
  Variable: "#0066FF",
};

function TrancheStructure(props: Props) {
  const { tranches, totalTranchesTarget } = props;

  const payload =
    tranches.length === 3
      ? [
          {
            name: "Senior",
            value: Number(
              getPercentage(tranches[0]?.target, totalTranchesTarget)
            ),
          },
          {
            name: "Mezzanine",
            value: Number(
              getPercentage(tranches[1]?.target, totalTranchesTarget)
            ),
          },
          {
            name: "Junior",
            value: Number(
              getPercentage(tranches[2]?.target, totalTranchesTarget)
            ),
          },
        ]
      : [
          {
            name: "Fixed",
            value: Number(
              getPercentage(tranches[0]?.target, totalTranchesTarget)
            ),
          },
          {
            name: "Variable",
            value: Number(
              getPercentage(tranches[1]?.target, totalTranchesTarget)
            ),
          },
        ];

  return (
    <div className="block tranche-structure">
      <div className="background left-br">
        <div className="tranche-chart">
          {payload.map((t, i) => (
            <div
              className="tranche"
              style={{ height: t.value * 2 + "px", background: COLORS[t.name] }}
            />
          ))}
        </div>
      </div>
      <div className="background right-br">
        <div className="legend">
          {payload.map((t, i) => (
            <div key={t.name} className="farm-key">
              <div
                className="key-color"
                style={{ backgroundColor: COLORS[t.name] }}
              />
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrancheStructure;
