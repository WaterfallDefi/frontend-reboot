import React from 'react';

import {
  Modal,
  ModalProps,
  Network,
} from '../../WaterfallDefi';

type Props = {
  network: Network;
  txn?: string;
  status?: string;
  message?: string;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

enum ModalStatus {
  Pending = "PENDING",
  Submitted = "SUBMITTED",
  Rejected = "REJECTED",
  Reverted = "REVERTED",
  Completed = "COMPLETED",
  Error = "ERROR",
  MissingModalProps = "",
}

function TransactionModal(props: Props) {
  const { network, txn, status, message, setModal } = props;

  const InnerElement = () => {
    switch (status) {
      case ModalStatus.Pending.valueOf():
        return (
          <section className="transaction">
            <h1>Waiting For Confirmation</h1>
            <p>{message}</p>
            <span>Confirm this transaction in your wallet</span>
          </section>
        );

      case ModalStatus.Submitted.valueOf():
        return (
          <section className="transaction">
            <h1>Transaction Submitted</h1>
            {txn && (
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
            )}
            <button onClick={() => setModal({ state: Modal.None })}>
              Close
            </button>
          </section>
        );
      case ModalStatus.Rejected.valueOf():
        return (
          <section className="transaction">
            <h1>Transaction Rejected</h1>
            <button onClick={() => setModal({ state: Modal.None })}>
              Close
            </button>
          </section>
        );
      case ModalStatus.Reverted.valueOf():
        return (
          <section className="transaction">
            <h1>Transaction Reverted</h1>
            {txn && (
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
            )}
            <button onClick={() => setModal({ state: Modal.None })}>
              Close
            </button>
          </section>
        );
      case ModalStatus.Completed.valueOf():
        return (
          <section className="transaction">
            <h1>Transaction Completed</h1>
            {txn && (
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
            )}
            <button onClick={() => setModal({ state: Modal.None })}>
              Dismiss
            </button>
          </section>
        );
      case ModalStatus.Error.valueOf():
        return (
          <section className="transaction">
            <h1>Error</h1>
            {message && <p>{message}</p>}
            <button onClick={() => setModal({ state: Modal.None })}>
              Dismiss
            </button>
          </section>
        );
      case ModalStatus.MissingModalProps.valueOf():
      default:
        return (
          <section className="transaction">
            <h1>Error: Missing Modal Props</h1>
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
