import { config } from 'xdapp/blockchain/configs'

export const XDC = {
  symbol: 'XDC',
  name: 'XDC Token',
  address: config.contractAddresses.XDCToken,
  decimals: 18,
  chainId: config.chainId,
  sortOrder: 10,
}
export const USXD = {
  symbol: 'USxD',
  name: 'USD Token',
  address: config.contractAddresses.StableToken,
  decimals: 6,
  chainId: config.chainId,
  //exchangeAddress: config.contractAddresses.Exchange,
  sortOrder: 20,
}

export const NativeTokens = [XDC, USXD]
export const StableTokens = [USXD]

export const NativeTokensByAddress = {
  [XDC.address]: XDC,
  [USXD.address]: USXD,
}
