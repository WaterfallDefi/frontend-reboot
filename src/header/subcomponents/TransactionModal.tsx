import React from "react";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";

type Props = {
  network: Network;
  txn: string;
  status: Status;
  pendingMessage: string;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

enum Status {
  Pending = "PENDING",
  Submitted = "SUBMITTED",
  Rejected = "REJECTED",
  Completed = "COMPLETED",
}

function TransactionModal(props: Props) {
  const { network, txn, status, pendingMessage, setModal } = props;

  const InnerElement = () => {
    switch (status) {
      case Status.Pending:
        return (
          <section className="transaction">
            <h1>Waiting For Confirmation</h1>
            <p>{pendingMessage}</p>
            <span>Confirm this transaction in your wallet</span>
          </section>
        );

      case Status.Submitted:
        return (
          <section className="transaction">
            <h1>Transaction Submitted</h1>
            <a
              href={`${
                network === Network.BNB
                  ? "https://bscscan.com"
                  : "https://snowtrace.io"
              }/tx/${txn}`}
              target="_blank"
              rel="noreferrer"
            >
              {network === Network.BNB
                ? "View on BSCScan"
                : "View on Snowtrace"}
            </a>
            <button onClick={() => setModal({ state: Modal.None })}>
              Close
            </button>
          </section>
        );
      case Status.Rejected:
        return (
          <section className="transaction">
            <h1>Transaction Completed</h1>
            <a
              href={`${
                network === Network.BNB
                  ? "https://bscscan.com"
                  : "https://snowtrace.io"
              }/tx/${txn}`}
              target="_blank"
              rel="noreferrer"
            >
              {network === Network.BNB
                ? "View on BSCScan"
                : "View on Snowtrace"}
            </a>
            <button onClick={() => setModal({ state: Modal.None })}>
              Close
            </button>
          </section>
        );
      case Status.Completed:
        return (
          <section className="transaction">
            <h1>Transaction Rejected</h1>
            <button onClick={() => setModal({ state: Modal.None })}>
              Dismiss
            </button>
          </section>
        );
    }
  };

  return (
    <div className="modal transaction">
      {/* <title className="modal-title">Connect Wallet</title> */}
      {InnerElement()}
    </div>
  );
}

export default TransactionModal;
