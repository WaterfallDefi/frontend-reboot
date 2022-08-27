import React from "react";
import useRedeemDirect from "../../markets/hooks/useRedeemDirect";
import { Market } from "../../types";
import { ModalProps, Network } from "../../WaterfallDefi";

type Props = {
  network: Network;
  trancheMasterAddress: string;
  abi: any;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

function PortfolioFold(props: Props) {
  const { network, trancheMasterAddress, abi, setModal, setMarkets } = props;

  const { onRedeemDirect } = useRedeemDirect(network, trancheMasterAddress, abi, setModal, setMarkets);

  return (
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
              After maturity, you can choose to withdraw all the principal + yield. The platform will charge a fee of
              (principal + all yield in the current period) x
            </p>
            <p>
              You can also select roll-deposit to the next cycle, and you can change the Tranche and amount during
              Roll-deposit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioFold;
