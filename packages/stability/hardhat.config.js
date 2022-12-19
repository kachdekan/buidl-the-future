require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers')
require('hardhat-deploy')
require('hardhat-abi-exporter')
require('dotenv').config({path:__dirname+'/.env'})

const defaultNetwork = 'hardhat'
const mnemonicPath = "m/44'/52752'/0'/0/" 
const {DEV_MNEMONIC, ACC1, ACC2} = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
    ],
  },
  defaultNetwork,
  paths: {
    deploy: './scripts',
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: DEV_MNEMONIC,
        path: mnemonicPath,
        count: 5,
      },
      //forking: {
       // url: 'https://erpc.xinfin.network/'
      //}
    },
    localhost: {
      url: 'http://127.0.0.1:7545',
      chainId: 31337,
      accounts: [ACC1, ACC2],
      gasPrice: 2500000000,
      gas: 35000000,
    },
    apothem_xdc: {
      url: 'https://rpc.apothem.network',
      accounts: [ACC1, ACC2],
      gasPrice: 2500000000,
      gas: 35000000,
      chainId: 51,
      loggingEnabled: true,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5', //web3-v1
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()
  for (const account of accounts) {
    console.log(account.address)
  }
})

task(
  'dev-keys',
  'Prints the private keys associated with the devchain',
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    const hdNode = hre.ethers.utils.HDNode.fromMnemonic(DEV_MNEMONIC)
    for (let i = 0; i < accounts.length; i++) {
      const account = hdNode.derivePath(`${mnemonicPath}${i}`)
      console.log(`Account ${i}\nAddress: ${account.address}\nKey: ${account.privateKey}`)
    }
  },
)