import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  title: string;
  text: string;
}

const Accordion: FC<Props> = ({ title, text }) => {
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
              src="/chains/celo.svg"
              alt="celo-chain"
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
          {title}
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
      <p
        className={`flex items-center opacity-70 transition-all duration-300 mt-2`}
        style={{ maxHeight: opened ? "50px" : "0", overflow: "hidden" }}
      >
        {text}
      </p>
    </div>
  );
};

export default Accordion;
