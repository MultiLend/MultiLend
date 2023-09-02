import { FC } from "react";
import Modal from "./Modal";
import Image from "next/image";

interface Props {
  isTokenModal: boolean;
  toggleTokenModal: () => void;
  isChainModal: boolean;
  toggleChainModal: (chain?: string) => void;
}

const Modals: FC<Props> = ({
  isTokenModal,
  toggleTokenModal,
  isChainModal,
  toggleChainModal,
}) => {
  return (
    <>
      {
        <Modal
          title={"Select Token"}
          isOpen={isTokenModal}
          closeModal={toggleTokenModal}
        >
          <div
            className="flex items-center gap-2 bg-background rounded-xl p-2 hover:border hover:border-outline cursor-pointer"
            onClick={toggleTokenModal}
          >
            <Image
              src={"/tokens/usdc.svg"}
              alt={"usdc-token"}
              width={16}
              height={16}
            />
            USDC
          </div>
        </Modal>
      }
      {
        <Modal
          title={"Select Chain"}
          isOpen={isChainModal}
          closeModal={toggleChainModal}
        >
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 bg-background rounded-xl p-2 hover:border hover:border-outline cursor-pointer"
              onClick={() => toggleChainModal('MNT')}
            >
              <Image
                src={"/chains/mnt.svg"}
                alt={"mnt-chain"}
                width={16}
                height={16}
              />
              MNT
            </div>
            <div
              className="flex items-center gap-2 bg-background rounded-xl p-2 hover:border hover:border-outline cursor-pointer"
              onClick={() => toggleChainModal('CELO')}
            >
              <Image
                src={"/chains/celo.svg"}
                alt={"celo-chain"}
                width={16}
                height={16}
              />
              CELO
            </div>
            <div
              className="flex items-center gap-2 bg-background rounded-xl p-2 hover:border hover:border-outline cursor-pointer"
              onClick={() => toggleChainModal('ETH')}
            >
              <Image
                src={"/chains/eth.svg"}
                alt={"celo-chain"}
                width={16}
                height={16}
              />
              ETH <span className="text-xs opacity-50">Sepolia</span>
            </div>
          </div>
        </Modal>
      }
    </>
  );
};

export default Modals;
