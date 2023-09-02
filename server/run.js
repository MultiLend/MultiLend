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

const sepoliaSigner = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
); // CHAINID: 11155111

const mantlesigner = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  new ethers.JsonRpcProvider(process.env.MANTLE_RPC_URL)
); // CHAINID: 5001

const celoContract = new ethers.Contract(
  process.env.CELO_CONTRACT_ADDRESS,
  MLContractABI,
  celoSigner
);

const sepoliaContract = new ethers.Contract(
  process.env.SEPOLIA_CONTRACT_ADDRESS,
  MLContractABI,
  sepoliaSigner
);

const mantleContract = new ethers.Contract(
  process.env.MANTLE_CONTRACT_ADDRESS,
  MLContractABI,
  mantlesigner
);

// Listen for BorrowCS Event
celoContract.on("BorrowCS", async (recipient, amount, chain, tokenAddress) => {
  switch (chain) {
    case 5001n:
      console.log("-- Received event to Borrow on Mantle Chain --");
      const txMantle = await mantleContract.borrowOut(recipient, amount);
      console.log(`Borrowed on Mantle Chain: ${txMantle.hash}`);
      break;
    case 11155111n:
      console.log("-- Received event to Borrow on Sepolia Chain --");
      const txSepolia = await sepoliaContract.borrowOut(recipient, amount);
      console.log(`Borrowed on Sepolia Chain: ${txSepolia.hash}`);
 
    default:
      console.error("Something went wrong, couldnt detect chain");
  }
});


sepoliaContract.on("BorrowCS", async (recipient, amount, chain, tokenAddress) => {
  switch (chain) {
    case 5001n:
      console.log("-- Received event to Borrow on Mantle Chain --");
      const txMantle = await mantleContract.borrowOut(recipient, amount);
      console.log(`Borrowed on Mantle Chain: ${txMantle.hash}`);
      break;
    case 44787n:
      console.log("-- Received event to Borrow on Sepolia Chain --");
      const txSepolia = await sepoliaContract.borrowOut(recipient, amount);
      console.log(`Borrowed on Sepolia Chain: ${txSepolia.hash}`);
 
    default:
      console.error("Something went wrong, couldnt detect chain");
  }
});


mantleContract.on("BorrowCS", async (from, amount, chain, tokenAddress) => {
  switch (chain) {
    case 44787n:
      console.log("-- Received event to Borrow on Celo Chain --");
      const txCelo = await celoContract.borrowOut(from, amount);
      console.log(`Borrowed on Celo Chain: ${txCelo.hash}`);
     case 11155111n:
        console.log("-- Received event to Borrow on Sepolia Chain --");
        const txMantle = await sepoliaContract.borrowOut(recipient, amount);
        console.log(`Borrowed on Sepolia Chain: ${txMantle.hash}`);
      break;
    default:
      console.error("Something went wrong, couldnt detect chain");
  }
});
