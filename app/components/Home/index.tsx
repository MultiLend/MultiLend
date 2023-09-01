import { FC, useMemo, useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Meta from "./Meta";
import Button from "./Button";
import Accordion from "./Accordion";

const Home: FC = () => {
  const [lendInput, setLendInput] = useState("");
  const [borrowInput, setBorrowInput] = useState("");

  const lendMeta = useMemo(() => {
    return [
      {
        title: "Deposited Amount",
        value: "0.23",
      },
    ];
  }, []);

  const borrowMeta = useMemo(() => {
    return [
      {
        title: "Deposited Amount",
        value: "0.23",
      },
    ];
  }, []);

  const onLendInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLendInput(e.target.value);

  const onBorrowInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBorrowInput(e.target.value);

  const lend = () => {
    console.log(lendInput);
  };

  const borrow = () => {
    console.log(borrowInput);
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-2 gap-x-28 gap-y-16">
        <Card title="Lend">
          <Input
            chain="ETH"
            input={lendInput}
            onChange={onLendInputChange}
            token="USDC"
          />
          <Meta meta={lendMeta} />
          <Button title="Lend" isActive={true} onClick={lend} />
        </Card>
        <Card title="Borrow">
          <Input
            chain="ETH"
            input={borrowInput}
            onChange={onBorrowInputChange}
            token="USDC"
          />
          <Meta meta={borrowMeta} />
          <Button title="Borrow" isActive={true} onClick={borrow} />
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-lg">My Positions</h1>
        <Accordion title="Collateral" text="this is some text" />
        {/* <div className="w-full h-12 rounded-lg bg-secondary"></div> */}
      </div>
    </div>
  );
};

export default Home;
