import Image from "next/image";
import { FC } from "react";

interface Props {
  chain: string;
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: string;
  chainModal: () => void;
  tokenModal: () => void;
}

const Input: FC<Props> = ({
  chain,
  input,
  onChange,
  token,
  chainModal,
  tokenModal,
}) => {
  return (
    <div className="flex h-10 rounded-lg bg-background border-2 border-outline">
      <div
        className="flex items-center justify-center gap-1 w-1/4 border-r-2 border-outline cursor-pointer"
        onClick={chainModal}
      >
        <Image
          src={`/chains/${chain.toLowerCase()}.svg`}
          alt={`${chain}-chain`}
          width="16"
          height="16"
        />
        {chain}
      </div>
      <div className="w-2/4">
        <input
          className="flex items-center justify-center w-full h-full bg-transparent p-2 focus:outline-none"
          type="number"
          // placeholder="Input amount..."
          value={input}
          onChange={onChange}
        />
      </div>
      <div
        className="flex items-center justify-center gap-1 w-1/4 border-l-2 border-outline cursor-pointer"
        onClick={tokenModal}
      >
        <Image
          src={`/tokens/${token.toLowerCase()}.svg`}
          alt={`${token}-token`}
          width="16"
          height="16"
        />
        {token}
      </div>
    </div>
  );
};

export default Input;
