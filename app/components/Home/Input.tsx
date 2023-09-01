import { FC } from "react";

interface Props {
  chain: string;
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: string;
}

const Input: FC<Props> = ({ chain, input, onChange, token }) => {
  return (
    <div className="flex h-10 rounded-lg bg-background border-2 border-outline">
      <div className="flex items-center justify-center w-1/4 border-r-2 border-outline cursor-pointer">
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
      <div className="flex items-center justify-center w-1/4 border-l-2 border-outline cursor-pointer">
        {token}
      </div>
    </div>
  );
};

export default Input;
