const fs = require('fs');
const ethers = require('ethers');

// Read the JSON file
const rawData = fs.readFileSync('/Users/sandro/Desktop/MultiLend/chronicletest/config.json');

const config = JSON.parse(rawData);
console.log(config)
// Initialize Ethers.js
const provider = new ethers.JsonRpcProvider("https://sepolia.gateway.tenderly.co");  // Replace with your own Ethereum RPC URL
const privateKey = "380297002cb74ca7011b246df75e5d0e906db1587894f3e017d967596dd25156"; // Replace with your private key
const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);

// Extract contract address and ABI
const contractAddress = config.selfKisser.contractAddress;
const contractAbi = config.selfKisser.abi;

// Create new contract instance
const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

const init = async () =>
{
   const selfKiss = await contractInstance.read()
   console.log(selfKiss)
}
init()
console.log("Contract instance created:", contractInstance);

