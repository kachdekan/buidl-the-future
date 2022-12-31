const { config } = require('../blockchain/configs')

const XDC = {
  symbol: 'XDC',
  name: 'XDC Token',
  address: config.contractAddresses.XDCToken,
  decimals: 18,
  chainId: config.chainId,
  sortOrder: 10,
}
const USXD = {
  symbol: 'USxD',
  name: 'USD Token',
  address: config.contractAddresses.StableToken,
  decimals: 6,
  chainId: config.chainId,
  //exchangeAddress: config.contractAddresses.Exchange,
  sortOrder: 20,
}

const NativeTokens = [XDC, USXD]
const StableTokens = [USXD]

const NativeTokensByAddress = {
  [XDC.address]: XDC,
  [USXD.address]: USXD,
}

module.exports = {
  XDC,
  USXD,
  NativeTokens,
  NativeTokensByAddress,
  StableTokens,
}
