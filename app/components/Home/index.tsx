import { FC, useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Meta from "./Meta";
import Button from "./Button";
import Accordion from "./Accordion";
import Modals from "./Modals";
import MetaMaskSDK from "@metamask/sdk";
import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";
import {
  CELO_MULTILEND,
  CELO_USDC,
  CHAINIDS,
  ERC20_ABI,
  MANTLE_MULTILEND,
  MANTLE_USDC,
  MULTILEND_ABI,
  SEPOLIA_MULTILEND,
  SEPOLIA_USDC,
} from "@/constants";
import { capitalizeFirstLetter } from "@/utils/format";

const Home: FC = () => {
  const token = "USDC";

  const options = {
    injectProvider: true,
    dappMetadata: { name: "MultiLend", url: "MultiLend.com" },
  };

  const MMSDK = new MetaMaskSDK(options);

  const ethereum = MMSDK.getProvider();

  const [lendInput, setLendInput] = useState("");
  const [borrowInput, setBorrowInput] = useState("");

  const [isTokenModal, setIsTokenModal] = useState(false);
  const [isChainModal, setIsChainModal] = useState(false);

  const [currentSide, setCurrentSide] = useState<"lend" | "borrow">("lend");

  const [chainLend, setChainLend] = useState("CELO");
  const [chainBorrow, setChainBorrow] = useState("MNT");

  const [balanceCelo, setBalanceCelo] = useState("0.00");
  const [balanceMantle, setBalanceMantle] = useState("0.00");
  const [balanceSepolia, setBalanceSepolia] = useState("0.00");

  const [positions, setPositions] = useState({
    celo: {
      supply: "0",
      borrow: "0",
    },
    mantle: {
      supply: "0",
      borrow: "0",
    },
    sepolia: {
      supply: "0",
      borrow: "0",
    },
  });

  useEffect(() => {
    getBalance();
    getPositions();
    const intervalId = setInterval(() => {
      getBalance();
      getPositions();
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBalance = async () => {
    const address: string[] = (await ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    })) as string[];

    const celoProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_CELO_RPC_URL
    );
    const mantleProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_MANTLE_RPC_URL
    );
    const sepoliaProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
    );

    const celoTokenInstance = new ethers.Contract(
      CELO_USDC,
      ERC20_ABI,
      celoProvider
    );

    const mantleTokenInstance = new ethers.Contract(
      MANTLE_USDC,
      ERC20_ABI,
      mantleProvider
    );

    const sepoliaTokenInstance = new ethers.Contract(
      SEPOLIA_USDC,
      ERC20_ABI,
      sepoliaProvider
    );

    const balCelo = await celoTokenInstance.balanceOf(address[0]);
    setBalanceCelo(ethers.formatEther(balCelo));

    const balMantle = await mantleTokenInstance.balanceOf(address[0]);
    setBalanceMantle(ethers.formatEther(balMantle));

    const balSepolia = await sepoliaTokenInstance.balanceOf(address[0]);
    setBalanceSepolia(ethers.formatEther(balSepolia));
  };

  const getPositions = async () => {
    const address: string[] = (await ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    })) as string[];

    const celoProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_CELO_RPC_URL
    );
    const mantleProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_MANTLE_RPC_URL
    );
    const sepoliaProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
    );

    const multiLendCeloInstance = new ethers.Contract(
      CELO_MULTILEND,
      MULTILEND_ABI,
      celoProvider
    );

    const multiLendMantleInstance = new ethers.Contract(
      MANTLE_MULTILEND,
      MULTILEND_ABI,
      mantleProvider
    );

    const multiLendSepoloaInstance = new ethers.Contract(
      SEPOLIA_MULTILEND,
      MULTILEND_ABI,
      sepoliaProvider
    );

    const suppliedCelo = await multiLendCeloInstance.balance(address[0]);
    const borrowedCelo = await multiLendCeloInstance.borrowed(address[0]);
    const suppliedMantle = await multiLendMantleInstance.balance(address[0]);
    const borrowedMantle = await multiLendMantleInstance.borrowed(address[0]);
    const suppliedSepolia = await multiLendSepoloaInstance.balance(address[0]);
    const borrowedSepolia = await multiLendSepoloaInstance.borrowed(address[0]);

    setPositions({
      celo: {
        supply: ethers.formatEther(suppliedCelo),
        borrow: ethers.formatEther(borrowedCelo),
      },
      mantle: {
        supply: ethers.formatEther(suppliedMantle),
        borrow: ethers.formatEther(borrowedMantle),
      },
      sepolia: {
        supply: ethers.formatEther(suppliedSepolia),
        borrow: ethers.formatEther(borrowedSepolia),
      },
    });
  };

  const lendMeta = useMemo(() => {
    return [
      {
        title: "Balance",
        value:
          chainLend === "CELO"
            ? balanceCelo
            : chainLend === "MNT"
            ? balanceMantle
            : balanceSepolia,
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
        value: lendInput ? "4.00%" : "0.00",
      },
    ];
  }, [balanceCelo, balanceMantle, balanceSepolia, chainLend, lendInput]);

  const borrowMeta = useMemo(() => {
    const total =
      Number(positions.celo.supply) +
      Number(positions.mantle.supply) +
      Number(positions.sepolia.supply);

    return [
      {
        title: "Available",
        value: total > 0 ? total.toFixed(2) : "0.00",
      },
      {
        title: "Repayment Amount",
        value: borrowInput ? (Number(borrowInput) * 1.05).toFixed(2) : "0.00",
      },
      {
        title: "Interest Rate",
        value: borrowInput ? "5.00%" : "0.00",
      },
      {
        title: "Borrow Limit",
        value: total > 0 ? (total * 0.8).toFixed(2) : "0.00",
      },
    ];
  }, [borrowInput, positions]);

  const onLendInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLendInput(e.target.value);

  const onBorrowInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBorrowInput(e.target.value);

  const toggleTokenModal = () => setIsTokenModal(!isTokenModal);

  const toggleChainModal = (chain?: string) => {
    setIsChainModal(!isChainModal);

    if (chain) {
      currentSide === "lend" ? setChainLend(chain) : setChainBorrow(chain);

      // TODO: SWITCH CHAINS
    }
  };

  const toggleLendChainModal = () => {
    setCurrentSide("lend");
    toggleChainModal();
  };

  const toggleBorrowChainModal = () => {
    setCurrentSide("borrow");
    toggleChainModal();
  };

  const lend = async () => {
    const provider = new BrowserProvider(ethereum);

    const usdcTokenInstance = new ethers.Contract(
      chainLend === "CELO"
        ? CELO_USDC
        : chainLend === "MNT"
        ? MANTLE_USDC
        : SEPOLIA_USDC,
      ERC20_ABI,
      await provider.getSigner()
    );

    const approveTx = await usdcTokenInstance.approve(
      chainLend === "CELO"
        ? CELO_MULTILEND
        : chainLend === "MNT"
        ? MANTLE_MULTILEND
        : SEPOLIA_MULTILEND,
      ethers.parseEther(lendInput)
    );

    console.log(approveTx);

    const multiLendInstance = new ethers.Contract(
      chainLend === "CELO"
        ? CELO_MULTILEND
        : chainLend === "MNT"
        ? MANTLE_MULTILEND
        : SEPOLIA_MULTILEND,
      MULTILEND_ABI,
      await provider.getSigner()
    );

    const transaction = multiLendInstance.supply(ethers.parseEther(lendInput));

    console.log(transaction);
  };

  const borrow = async () => {
    const provider = new BrowserProvider(ethereum);

    // const usdcTokenInstance = new ethers.Contract(
    //   chainLend === "CELO" ? CELO_USDC : chainLend === 'MNT' ? MANTLE_USDC : SEPOLIA_USDC,
    //   ERC20_ABI,
    //   await provider.getSigner()
    // );

    // const approveTx = await usdcTokenInstance.approve(
    //   chainLend === "CELO" ? CELO_USDC : chainLend === 'MNT' ? MANTLE_USDC : SEPOLIA_USDC,
    //   ethers.parseEther(lendInput)
    // );

    // console.log(approveTx);

    const multiLendInstance = new ethers.Contract(
      chainLend === "CELO"
        ? CELO_MULTILEND
        : chainLend === "MNT"
        ? MANTLE_MULTILEND
        : SEPOLIA_MULTILEND,
      MULTILEND_ABI,
      await provider.getSigner()
    );

    const transaction = multiLendInstance.borrowCS(
      ethers.parseEther(borrowInput),
      (CHAINIDS as any)[chainBorrow],
      chainLend === "CELO"
        ? CELO_USDC
        : chainLend === "MNT"
        ? MANTLE_USDC
        : SEPOLIA_USDC
    );

    console.log(transaction);
  };

  const withdraw = async (chain: string, amount: string) => {
    const provider = new BrowserProvider(ethereum);

    switch (chain) {
      case "celo":
        const multiLendInstanceCelo = new ethers.Contract(
          CELO_MULTILEND,
          MULTILEND_ABI,
          await provider.getSigner()
        );

        const txCelo = multiLendInstanceCelo.withdraw(
          ethers.parseEther(amount)
        );

        console.log(txCelo);
        break;
      case "mantle":
        const multiLendInstanceMnt = new ethers.Contract(
          MANTLE_MULTILEND,
          MULTILEND_ABI,
          await provider.getSigner()
        );

        const txMnt = multiLendInstanceMnt.withdraw(ethers.parseEther(amount));

        console.log(txMnt);
        break;
      case "sepolia":
        const multiLendInstanceEth = new ethers.Contract(
          SEPOLIA_MULTILEND,
          MULTILEND_ABI,
          await provider.getSigner()
        );

        const txEth = multiLendInstanceEth.withdraw(ethers.parseEther(amount));

        console.log(txEth);
        break;
    }
  };

  const repay = async (chain: string, amount: string) => {
    const provider = new BrowserProvider(ethereum);

    switch (chain) {
      case "celo":
        const multiLendInstanceCelo = new ethers.Contract(
          CELO_MULTILEND,
          MULTILEND_ABI,
          await provider.getSigner()
        );

        const txCelo = multiLendInstanceCelo.repayCS(
          ethers.parseEther(amount),
          5001,
          CELO_USDC
        );

        console.log(txCelo);
        break;
      case "mantle":
        const multiLendInstanceMnt = new ethers.Contract(
          MANTLE_MULTILEND,
          MULTILEND_ABI,
          await provider.getSigner()
        );

        const txMnt = multiLendInstanceMnt.repayCS(
          ethers.parseEther(amount),
          44787,
          CELO_USDC
        );

        console.log(txMnt);
        break;
      case "sepolia":
        console.log('here')
        const usdcTokenInstance = new ethers.Contract(
          SEPOLIA_USDC,
          ERC20_ABI,
          await provider.getSigner()
        );
    
        const approveTx = await usdcTokenInstance.approve(
          SEPOLIA_MULTILEND,
          ethers.parseEther(amount)
        );
    
        console.log(approveTx);
        
        const multiLendInstanceEth = new ethers.Contract(
          SEPOLIA_MULTILEND,
          MULTILEND_ABI,
          await provider.getSigner()
        );

        const txEth = multiLendInstanceEth.repayCS(
          ethers.parseEther(amount),
          44787,
          CELO_USDC
        );

        console.log(txEth);
        break;
    }
  };

  const liquidate = async () => {
    const address: string[] = (await ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    })) as string[];

    const provider = new BrowserProvider(ethereum);

    const multiLendInstanceCelo = new ethers.Contract(
      SEPOLIA_MULTILEND,
      MULTILEND_ABI,
      await provider.getSigner()
    );

    const tx = multiLendInstanceCelo.liquidateDemo(address[0]);

    console.log(tx);
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
        {Object.entries(positions).map(([key, value]) => (
          <div className="flex flex-col gap-2" key={key}>
            {value.supply !== "0" && value.supply !== "0.0" && (
              <Accordion
                chain={key}
                type={`Supplied USDC on ${capitalizeFirstLetter(key)}`}
                action={"Withdraw"}
                amount={value.supply}
                onClick={withdraw}
                liquidate={liquidate}
              />
            )}
            {value.borrow !== "0" && value.borrow !== "0.0" && (
              <Accordion
                chain={key}
                type={`Borrowed USDC on ${capitalizeFirstLetter(key)}`}
                action={"Repay"}
                amount={value.borrow}
                onClick={repay}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
