import deployed from './Abis/Jsons/deployed.json'

const configPolygonMumbai = {
  jsonRpcUrlPrimary: 'https://erpc.apothem.network',
  blockscoutUrl: 'https://explorer.apothem.network/',
  apiBlockscountEndpoint: 'https://xdc.blocksscan.io/api/',
  name: 'apothem',
  chainId: 51,
  contractAddresses: {
    StableToken: '0xE097d6B3100777DC31B34dC2c58fB524C2e76921', //USxD
    MaticToken: '0x0000000000000000000000000000000000001010',
    Spaces: deployed[80001][0].contracts.Spaces.address, //deployed[chainId][0].contracts.Spaces.address,
    RoscaSpace: '0x0000000000000000000000000000000000000000',
    PersonalSpace: '0x0000000000000000000000000000000000000000',
    GroupSpace: '0x0000000000000000000000000000000000000000',
  },
}

exports.config = Object.freeze(configPolygonMumbai)
