import config from './config.json'
import multiLendArtifact from './build/contracts/MultiLend.json'
import usdcArtifact from './build/contracts/USDC.json'

export const CELO_MULTILEND = config.celo.multilend
export const MANTLE_MULTILEND = config.mantle.multilend
export const SEPOLIA_MULTILEND = config.sepolia.multilend

export const CELO_USDC = config.celo.usdc
export const MANTLE_USDC = config.mantle.usdc
export const SEPOLIA_USDC = config.sepolia.usdc

export const MULTILEND_ABI = multiLendArtifact.abi
export const ERC20_ABI = usdcArtifact.abi

export const CHAINIDS = {
  "CELO": 44787,
  "MNT": 5001,
  "ETH": 11155111,
}
