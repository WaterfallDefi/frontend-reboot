import BigNumber from "bignumber.js";
import { Market } from "../../types";
import { Hill } from "../svgs/Hill";
import ApproveCardDefault from "./ApproveCardDefault";
import TrancheCard from "./TrancheCard";
import Countdown from "react-countdown";
import dayjs from "dayjs";
import ApproveCardSimul from "./ApproveCardSimul";
import { useState } from "react";
import getRemaining, { getRemainingMulticurrency } from "../hooks/getRemaining";

const BIG_TEN = new BigNumber(10);

type Props = {
  selectedMarket: Market;
  coingeckoPrices: any;
  selectedDepositAssetIndex: number;
  setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  simulDeposit: boolean;
  setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setConnectWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  balance: string | string[];
};

const compareNum = (
  num1: string | number | undefined,
  num2: string | undefined,
  largerOnly = false
) => {
  if (num1 === undefined) return false; //modified, this case will never happen
  if (num2 === undefined) return false; // ""
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};

const handleReminder = (startTime: number, endTime: number) => {
  if (!window || !startTime || !endTime) return;
  const start =
    new Date(startTime * 1000).getFullYear() +
    new Date(startTime * 1000).getMonth() +
    new Date(startTime * 1000).getDay() +
    "T" +
    new Date(startTime * 1000).getHours() +
    new Date(startTime * 1000).getMinutes();
  const end =
    new Date(endTime * 1000).getFullYear() +
    new Date(endTime * 1000).getMonth() +
    new Date(endTime * 1000).getDay() +
    "T" +
    new Date(endTime * 1000).getHours() +
    new Date(endTime * 1000).getMinutes();
  window?.open(
    `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start}/${end}&text=Waterfall`,
    "_blank"
  );
};

const formatTimestamp = (num: string | number) => {
  const format1 = "YYYY/MM/DD HH:mm:ss";
  const d = parseInt(num + "000");
  return dayjs(d).format(format1);
};

function Deposit(props: Props) {
  const {
    selectedMarket,
    coingeckoPrices,
    selectedDepositAssetIndex,
    setSelectedDepositAssetIndex,
    simulDeposit,
    setSimulDeposit,
    setConnectWalletModalOpen,
    balance,
  } = props;

  const [selectTrancheIdx, setSelectTrancheIdx] = useState<number | undefined>(
    undefined
  );

  const deposited: BigNumber[] = [];
  const tokens = selectedMarket.tokens;
  const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined =
    selectedMarket.trancheInvests;
  if (trancheInvest) {
    selectedMarket.assets.forEach((a, i) =>
      deposited.push(
        trancheInvest
          .reduce(
            (acc: BigNumber, next) =>
              acc.plus(new BigNumber(next[i].hex.toString())),
            new BigNumber(0)
          )
          .dividedBy(BIG_TEN.pow(18))
      )
    );
  }
  const maxDeposits = tokens.map((t) =>
    new BigNumber(selectedMarket.totalTranchesTarget).multipliedBy(
      new BigNumber(t.percent.hex).dividedBy(BIG_TEN.pow(5))
    )
  );
  const remainingDepositable = new BigNumber(
    maxDeposits[selectedDepositAssetIndex]
  ).minus(deposited[selectedDepositAssetIndex]);
  const remainingDepositableSimul = maxDeposits.map((md, i) =>
    new BigNumber(md).minus(deposited[i])
  );

  const { remaining, remainingExact } =
    selectTrancheIdx !== undefined
      ? !selectedMarket.isMulticurrency
        ? getRemaining(
            selectedMarket.tranches[selectTrancheIdx]?.target,
            !selectedMarket.autorollImplemented
              ? selectedMarket.tranches[selectTrancheIdx]?.principal
              : (
                  Number(selectedMarket.tranches[selectTrancheIdx]?.principal) +
                  Number(
                    selectedMarket.tranches[selectTrancheIdx]?.autoPrincipal
                  )
                ).toString(),
            selectedMarket.assets[0] === "USDC" ||
              selectedMarket.assets[0] === "USDC.e"
              ? 6
              : 18
          )
        : getRemainingMulticurrency(
            selectedMarket.tranches[selectTrancheIdx]?.target,
            selectedMarket.tranches[selectTrancheIdx]?.principal,
            remainingDepositable
          )
      : { remaining: "", remainingExact: "" };

  const returnWidth = (assetIndex: number) =>
    deposited[assetIndex]
      ? deposited[assetIndex]
          .dividedBy(
            tokens.length > 0
              ? maxDeposits[assetIndex].toString()
              : new BigNumber(1)
          )
          .multipliedBy(100)
          .toString()
      : 0;
  const width = selectedMarket.isMulticurrency
    ? returnWidth(selectedDepositAssetIndex)
    : 1;
  const widths = selectedMarket.isMulticurrency
    ? selectedMarket.assets.map((a, i) => returnWidth(i))
    : [];

  return (
    <div className="deposit">
      <div className="next-cycle-wrapper">
        <Hill />
        <div className="next-cycle">
          Next Cycle
          <Countdown
            date={
              (Number(selectedMarket.duration) +
                Number(selectedMarket.actualStartAt)) *
              1000
            }
            renderer={({ days, hours, minutes, seconds, completed }) => {
              return (
                <span>
                  {!completed && (
                    <>
                      {days}D {hours}H {minutes}M {seconds}S
                    </>
                  )}
                </span>
              );
            }}
          />
        </div>
        <div className="active-cycle">
          Active Cycle
          {formatTimestamp(
            selectedMarket.actualStartAt ? selectedMarket.actualStartAt : 0
          )}{" "}
          -
          {formatTimestamp(
            Number(
              selectedMarket.actualStartAt ? selectedMarket.actualStartAt : 0
            ) + Number(selectedMarket.duration ? selectedMarket.duration : 0)
          )}{" "}
          {selectedMarket.duration}
        </div>
        <div className="button">Remind Me</div>
      </div>
      <div className="top-bar">
        <div className="step-bar">
          <div className="step">1</div>
          <div className="step-name">Choose Tranche</div>
          <div className="line" />
          <div className="step">2</div>
          <div className="step-name">Deposit</div>
        </div>

        {selectedMarket.isMulticurrency ? (
          <div className="select-deposit-assets">
            {selectedMarket.assets.map((asset, index) => (
              <div className="select-deposit-asset">
                <div
                  className="coin"
                  style={{ backgroundImage: `url(/coins/${asset}.png)` }}
                />
                <div className="step-name">
                  <span className="rem-value">
                    {deposited[index].toString()} /{" "}
                    {maxDeposits[index].toString()}
                  </span>{" "}
                  Remaining
                </div>
                <div className="remaining-depositable-outer">
                  <div
                    className="remaining-depositable-inner"
                    style={{ width: widths[index] + "%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="deposit-item">
        <div className="tranches">
          {selectedMarket.tranches.map((t, i) => {
            return (
              <TrancheCard
                key={i}
                selectedMarket={selectedMarket}
                selectedDepositAssetIndex={selectedDepositAssetIndex}
                tranche={t}
                trancheIndex={i}
                selected={selectTrancheIdx === i}
                setSelectTrancheIdx={setSelectTrancheIdx}
                coingeckoPrices={coingeckoPrices}
              />
            );
          })}
        </div>
        {!simulDeposit ? (
          <ApproveCardDefault
            selectedMarket={selectedMarket}
            selectedDepositAssetIndex={selectedDepositAssetIndex}
            setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
            setSimulDeposit={setSimulDeposit}
            setConnectWalletModalOpen={setConnectWalletModalOpen}
            selectTrancheIdx={selectTrancheIdx}
            redepositBalance={balance}
            remaining={remaining}
            remainingExact={remainingExact}
            enabled={selectTrancheIdx !== undefined}
            isSoldOut={
              selectTrancheIdx
                ? !selectedMarket.autorollImplemented
                  ? compareNum(
                      selectedMarket.tranches[selectTrancheIdx].principal,
                      selectedMarket.tranches[selectTrancheIdx].target
                    )
                  : compareNum(
                      Number(
                        selectedMarket.tranches[selectTrancheIdx].autoPrincipal
                      ) +
                        Number(
                          selectedMarket.tranches[selectTrancheIdx].principal
                        ),
                      selectedMarket.tranches[selectTrancheIdx].target
                    )
                : false
            }
          />
        ) : (
          <ApproveCardSimul
            selectedMarket={selectedMarket}
            setSimulDeposit={setSimulDeposit}
            setConnectWalletModalOpen={setConnectWalletModalOpen}
            selectTrancheIdx={selectTrancheIdx}
            remainingSimul={
              selectTrancheIdx !== undefined && selectedMarket.isMulticurrency
                ? remainingDepositableSimul.map((remainingDepositable) =>
                    getRemainingMulticurrency(
                      selectedMarket.tranches[selectTrancheIdx].target,
                      selectedMarket.tranches[selectTrancheIdx].principal,
                      remainingDepositable
                    )
                  )
                : selectedMarket.assets.map(() => {
                    return {
                      remaining: "",
                      remainingExact: "",
                      depositableOrInTranche: "",
                    };
                  })
            }
            enabled={selectTrancheIdx !== undefined}
            isSoldOut={
              selectTrancheIdx
                ? compareNum(
                    selectedMarket.tranches[selectTrancheIdx].principal,
                    selectedMarket.tranches[selectTrancheIdx].target
                  )
                : false
            }
          />
        )}
      </div>
    </div>
  );
}

export default Deposit;
