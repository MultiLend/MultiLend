const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const MLContractBuildPath = path.join(
  __dirname,
  "..",
  "build",
  "contracts",
  "MultiLend.json"
);
const MLContractJSON = JSON.parse(fs.readFileSync(MLContractBuildPath, "utf8"));
const MLContractABI = MLContractJSON.abi;

const celoSigner = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  new ethers.JsonRpcProvider(process.env.CELO_RPC_URL)
); // CHAINID: 44787

const mantlesigner = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  new ethers.JsonRpcProvider(process.env.MANTLE_RPC_URL)
); // CHAINID: 5001

const celoContract = new ethers.Contract(
  process.env.CELO_CONTRACT_ADDRESS,
  MLContractABI,
  celoSigner
);

const mantleContract = new ethers.Contract(
  process.env.MANTLE_CONTRACT_ADDRESS,
  MLContractABI,
  mantlesigner
);

// Listen for BorrowCS Event
celoContract.on("BorrowCS", async (from, amount, chain, tokenAddress) => {
  switch (chain) {
    case "5001":
      console.log("-- Received event to Borrow on Mantle Chain --");
      const txMantle = await mantleContract.borrowOut(from, amount);
      console.log(`Borrowed on Mantle Chain: ${txMantle.hash}`);
      break;
    default:
      console.error("Something went wrong, couldnt detect chain");
  }
});

mantleContract.on("BorrowCS", async (from, amount, chain, tokenAddress) => {
  switch (chain) {
    case "44787":
      console.log("-- Received event to Borrow on Celo Chain --");
      const txCelo = await celoContract.borrowOut(from, amount);
      console.log(`Borrowed on Celo Chain: ${txCelo.hash}`);
      break;
    default:
      console.error("Something went wrong, couldnt detect chain");
  }
});

// Listen for all Events
celoContract.on("*", (event) => {
  console.log("Received an event on Celo: ", event);
});

// Listen for all Events
mantleContract.on("*", (event) => {
  console.log("Received an event on Mantle: ", event);
});
