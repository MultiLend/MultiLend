const USDC = artifacts.require("USDC"); // Replace with your ERC20 contract name
const MultiLend = artifacts.require("MultiLend"); // Replace with your base contract name

module.exports = async function(deployer) {
  // Deploy the MintableToken first
  await deployer.deploy(USDC, "1000000000000000000000000"); // Parameters for the ERC20 constructor, if any

  // Get the deployed instance of the MintableToken
  const USDCTokenInstance = await USDC.deployed();

  // Deploy the BaseContract, passing the address of the mintable token as a parameter to the constructor
  await deployer.deploy(MultiLend, USDCTokenInstance.address);
};