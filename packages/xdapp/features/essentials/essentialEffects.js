import { setIsConnected, setIsSignered, setLoggedIn } from './essentialSlice'
import { setAppSigner } from 'xdapp/blockchain/blockchainHelper'
import { connectToProvider } from 'xdapp/blockchain/provider'
import { getWallets } from '../wallet/walletsManager'
import { decryptDataWpasscode } from 'xdapp/utils/encryption'

export const essentialListeners = (startListening) => {
  startListening({
    actionCreator: setIsConnected,
    effect: async (action, listenerApi) => {
      const tempPasscode = '223344'
      const { isConnected, isLoggedIn } = listenerApi.getState().essential
      const address = listenerApi.getState().wallet.walletInfo.address
      console.log(address)

      if (isConnected && isLoggedIn) {
        //get private key from store
        const userWallets = await getWallets()
        const enPrivateKey = userWallets.find((w) => w.address === address).enPrivateKey
        const privateKey = await decryptDataWpasscode(enPrivateKey, tempPasscode)

        if (privateKey && action.payload) {
          await setAppSigner(privateKey)
          listenerApi.dispatch(setIsSignered(true))
        } else {
          console.log('Unable to set signer')
          listenerApi.dispatch(setIsSignered(false))
        }
      } else if (!isConnected) {
        try {
          await connectToProvider()
          listenerApi.dispatch(setIsConnected(true))
        } catch (error) {
          console.log('Unable to connect to provider', error)
          listenerApi.dispatch(setIsConnected(false))
        }
      }
    },
  })
}
