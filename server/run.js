const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

console.log(process.env.PRIVATE_KEY)

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
  new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org")
); // CHAINID: 44787

const mantlesigner = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  new ethers.JsonRpcProvider("https://rpc.testnet.mantle.xyz")
); // CHAINID: 5001

const contract = new ethers.Contract(
  MLContractAddress,
  MLContractABI,
  provider
);

// Listen for BorrowCS Event
contract.on("BorrowCS", async (from, amount, chain, tokenAddress) => {
  switch (chain) {
    case "44787":
      console.log("-- Received event to Borrow on Celo Chain --");
      const celoContract = new ethers.Contract(
        process.env.CELO_CONTRACT_ADDRESS,
        MLContractABI,
        celoSigner
      );
      const txCelo = await celoContract.borrowOut(from, amount);
      console.log(`Borrowed on Celo Chain: ${txCelo.hash}`);
      break;
    case "5001":
      console.log("-- Received event to Borrow on Mantle Chain --");
      const mantleContract = new ethers.Contract(
        process.env.MANTLE_CONTRACT_ADDRESS,
        MLContractABI,
        mantlesigner
      );
      const txMantle = await mantleContract.borrowOut(from, amount);
      console.log(`Borrowed on Mantle Chain: ${txMantle.hash}`);
      break;
    default:
      console.error("Something went wrong, couldnt detect chain");
  }
});

// Listen for all Events
contract.on("*", (event) => {
  console.log("Received an event", event);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
