import deployed from './Abis/Jsons/deployed.json'

const configPolygonMumbai = {
  jsonRpcUrlPrimary: 'https://erpc.apothem.network',
  blockscoutUrl: 'https://explorer.apothem.network/',
  apiBlockscountEndpoint: 'https://apothem.blocksscan.io/api/',
  name: 'apothem',
  chainId: 51,
  contractAddresses: {
    StableToken: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5', //USxD
    XDCToken: '0x0000000000000000000000000000000000001010',
    Spaces: deployed[80001][0].contracts.Spaces.address, //deployed[chainId][0].contracts.Spaces.address,
    RoscaSpace: '0x0000000000000000000000000000000000000000',
    PersonalSpace: '0x0000000000000000000000000000000000000000',
    GroupSpace: '0x0000000000000000000000000000000000000000',
  },
}

exports.config = Object.freeze(configPolygonMumbai)
