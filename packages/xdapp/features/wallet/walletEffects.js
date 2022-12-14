import {
  createWallet as createWalletAct,
  importWallet,
  updateWalletAddress,
  fetchBalances,
  updateBalances,
} from './walletSlice'
import { createWallet, getBalances } from 'xdapp/blockchain/blockchainHelper'
import { encryptData } from 'xdapp/utils/encryption'
import { storeUserWallet } from 'xdapp/app/storage'
import { WALLETS_STORE } from '../../consts'
import { getDefaultNewWalletName, walletsListCache } from './walletsManager'
import { getPendingWallet } from './pendingWallet'
import { setLoggedIn } from '../essentials/essentialSlice'
import { NativeTokensByAddress } from './tokens'

export const walletListeners = (startListening) => {
  startListening({
    actionCreator: fetchBalances,
    effect: async (action, listenerApi) => {
      const isSignerSet = listenerApi.getState().essential.isSignerSet
      const address = listenerApi.getState().wallet.walletInfo.address
      if (isSignerSet && address) {
        const tokenAddrToValue = await getBalances(address, NativeTokensByAddress)
        listenerApi.dispatch(updateBalances({ tokenAddrToValue, lastUpdated: Date.now() }))
      }
    },
  })
  startListening({
    actionCreator: createWalletAct,
    effect: async (action, listenerApi) => {
      if (action.payload) {
        console.log('Creating and Storing Wallet')
        const passcode = action.payload
        const wallet = await createWallet()
        await addWallet(passcode, wallet)
        listenerApi.dispatch(updateWalletAddress(wallet.address))
        listenerApi.dispatch(setLoggedIn(true))
      }
    },
  })
  startListening({
    actionCreator: importWallet,
    effect: async (action, listenerApi) => {
      console.log('Importing wallet from Mnemonic')
      const passcode = action.payload
      const { importedWallet } = getPendingWallet()
      await addWallet(passcode, importedWallet)
      const currentAddr = listenerApi.getState().wallet.walletInfo.address
      if (!currentAddr) {
        listenerApi.dispatch(updateWalletAddress(importedWallet.address))
        listenerApi.dispatch(setLoggedIn(true))
      }
    },
  })
}

async function addWallet(passcode, wallet) {
  const enPrivateKey = await encryptData(wallet.privateKey, passcode)
  const enMnemonic = await encryptData(wallet.mnemonic, passcode)
  const walletName = await getDefaultNewWalletName()
  const newWallet = {
    walletName: walletName,
    address: wallet.address,
    enPrivateKey: enPrivateKey,
    enMnemonic: enMnemonic,
  }
  await storeUserWallet(WALLETS_STORE, newWallet)
  Object.assign(walletsListCache, { [wallet.address]: newWallet })
}
