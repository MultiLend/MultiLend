import { FC, useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Meta from "./Meta";
import Button from "./Button";
import Accordion from "./Accordion";
import Modals from "./Modals";

const Home: FC = () => {
  const token = "USDC";

  const [lendInput, setLendInput] = useState("");
  const [borrowInput, setBorrowInput] = useState("");

  const [isTokenModal, setIsTokenModal] = useState(false);
  const [isChainModal, setIsChainModal] = useState(false);

  const [currentSide, setCurrentSide] = useState<"lend" | "borrow">("lend");

  const [chainLend, setChainLend] = useState("CELO");
  const [chainBorrow, setChainBorrow] = useState("MNT");

  useEffect(() => {}, []);

  const lendMeta = useMemo(() => {
    return [
      {
        title: "Balance",
        value: "0.00",
      },
      {
        title: "Supplied Amount",
        value: Number(lendInput).toFixed(2),
      },
      {
        title: "Borrow Limit (80% CR)",
        value: (Number(lendInput) * 0.8).toFixed(2) ?? "0",
      },
      {
        title: "Average APY",
        value: lendInput ? "5.00%" : "0.00",
      },
    ];
  }, [lendInput]);

  const borrowMeta = useMemo(() => {
    return [
      {
        title: "Available",
        value: "0.00",
      },
      {
        title: "Repayment Amount",
        value: "0.00",
      },
      {
        title: "Interest Rate",
        value: "0.00",
      },
      {
        title: "Borrow Limit",
        value: "0.00",
      },
    ];
  }, []);

  const onLendInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLendInput(e.target.value);

  const onBorrowInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBorrowInput(e.target.value);

  const toggleTokenModal = () => setIsTokenModal(!isTokenModal);

  const toggleChainModal = (chain?: string) => {
    setIsChainModal(!isChainModal);

    if (chain)
      currentSide === "lend" ? setChainLend(chain) : setChainBorrow(chain);
  };

  const toggleLendChainModal = () => {
    setCurrentSide("lend");
    toggleChainModal();
  };

  const toggleBorrowChainModal = () => {
    setCurrentSide("borrow");
    toggleChainModal();
  };

  const lend = () => {
    console.log(lendInput);
  };

  const borrow = () => {
    console.log(borrowInput);
  };

  return (
    <div className="flex flex-col gap-16">
      <Modals
        isTokenModal={isTokenModal}
        toggleTokenModal={toggleTokenModal}
        isChainModal={isChainModal}
        toggleChainModal={toggleChainModal}
      />
      <div className="grid grid-cols-2 gap-x-28 gap-y-16">
        <Card title="Lend">
          <Input
            chain={chainLend}
            input={lendInput}
            onChange={onLendInputChange}
            token={token}
            chainModal={toggleLendChainModal}
            tokenModal={toggleTokenModal}
          />
          <Meta meta={lendMeta} />
          <Button title="Lend" isActive={!!lendInput} onClick={lend} />
        </Card>
        <Card title="Borrow">
          <Input
            chain={chainBorrow}
            input={borrowInput}
            onChange={onBorrowInputChange}
            token={token}
            chainModal={toggleBorrowChainModal}
            tokenModal={toggleTokenModal}
          />
          <Meta meta={borrowMeta} />
          <Button title="Borrow" isActive={!!borrowInput} onClick={borrow} />
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
