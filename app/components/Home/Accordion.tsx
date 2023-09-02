import Image from "next/image";
import { FC, useState } from "react";
import Button from "./Button";

interface Props {
  chain: string;
  type: string;
  action: string
  amount: string;
  onClick: (chain: string, amount: string) => void
}

const Accordion: FC<Props> = ({ chain, action, type, amount, onClick }) => {
  const [opened, setOpened] = useState(false);

  const toggle = () => {
    setOpened(!opened);
  };

  return (
    <div
      className="flex flex-col justify-center item-start px-4 py-3 cursor-pointer w-full rounded-lg bg-secondary"
      onClick={toggle}
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={`/chains/${chain}.svg`}
              alt={`${chain}-chain`}
              width="32"
              height="32"
            />
            <Image
              className="absolute bottom-0 right-0"
              src="/tokens/usdc.svg"
              alt="usdc-token"
              width="16"
              height="16"
            />
          </div>
          {type}
        </div>
        <Image
          className={`transition-all duration-300 ${
            opened ? "rotate-180" : "rotate-0"
          }`}
          src="/icons/dropdown.svg"
          alt="dropdown-icon"
          width="16"
          height="16"
        />
      </div>
      <div
        className="flex transition-all duration-300 mt-2"
        style={{ maxHeight: opened ? "50px" : "0", overflow: "hidden" }}
      >
        <div
          className={`flex items-center justify-between bg-background w-full py-2 px-3 rounded-lg`}
        >
          <p className="font-bold text-sm">Available to {action}: <span className="font-normal">{amount}</span></p>
          <Button title={action} isActive={true} onClick={() => onClick(chain, amount)} />
        </div>
      </div>
    </div>
  );
};

export default Accordion;
