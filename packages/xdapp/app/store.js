import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'

import essentialReducer from '../features/essentials/essentialSlice'
import walletReducer from '../features/wallet/walletSlice'
import spacesReducer from '../features/spaces/spacesSlice'

import { essentialListeners } from '../features/essentials/essentialEffects'
import { walletListeners } from '../features/wallet/walletEffects'
//import { spacesListeners } from '../features/spaces/spacesEffects'

import { blockscoutApi } from './services/blockscout'
import { newsdataApi } from './services/newsdata'

const listenerMiddleware = createListenerMiddleware()

export default configureStore({
  reducer: {
    essential: essentialReducer,
    wallet: walletReducer,
    spaces: spacesReducer,
    [blockscoutApi.reducerPath]: blockscoutApi.reducer,
    [newsdataApi.reducerPath]: newsdataApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      listenerMiddleware.middleware,
      blockscoutApi.middleware,
      newsdataApi.middleware,
    ),
})

//Listeners
essentialListeners(listenerMiddleware.startListening)
walletListeners(listenerMiddleware.startListening)
//spacesListeners(listenerMiddleware.startListening)
