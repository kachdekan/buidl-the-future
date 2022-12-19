const address = require('@ethersproject/address')

const {
  arrayify,
  BytesLike,
  concat,
  hexDataLength,
  hexDataSlice,
  isHexString,
  stripZeros,
} = require('@ethersproject/bytes')
const { BigNumber, BigNumberish, _base16To36, _base36To16 } = require('@ethersproject/bignumber')
const { keccak256 } = require('@ethersproject/keccak256')
const { encode } = require('@ethersproject/rlp')

const { Logger } = require('@ethersproject/logger')
const logger = new Logger('address/5.7.0')

console.log(address.isAddress('xdcE097d6B3100777DC31B34dC2c58fB524C2e76921'))

delete address['getAddress']

address.getAddress = function getAddress(address) {
  let result = null

  if (typeof address !== 'string') {
    logger.throwArgumentError('invalid address', 'address', address)
  }

  if (address.match(/^(xdc)?[0-9a-fA-F]{40}$/)) {
    // Missing the 0x prefix
    if (address.substring(0, 3) !== '0x') {
      address = '0x' + address.slice(3, 43)
    }

    result = getChecksumAddress(address)

    // It is a checksummed address with a bad checksum
    if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
      logger.throwArgumentError('bad address checksum', 'address', address)
    }

    // Maybe ICAP? (we only support direct mode)
  } else if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    // It is an ICAP address with a bad checksum
    if (address.substring(2, 4) !== ibanChecksum(address)) {
      logger.throwArgumentError('bad icap checksum', 'address', address)
    }

    result = _base36To16(address.substring(4))

    while (result.length < 40) {
      result = '0x' + result
    }
    result = getChecksumAddress('0x' + result)
  } else {
    logger.throwArgumentError('invalid address', 'address', address)
  }
  return result
}

function getChecksumAddress(address) {
  if (!isHexString(address, 20)) {
    logger.throwArgumentError('invalid address', 'address', address)
  }

  address = address.toLowerCase()

  const chars = address.substring(2).split('')

  const expanded = new Uint8Array(40)
  for (let i = 0; i < 40; i++) {
    expanded[i] = chars[i].charCodeAt(0)
  }

  const hashed = arrayify(keccak256(expanded))

  for (let i = 0; i < 40; i += 2) {
    if (hashed[i >> 1] >> 4 >= 8) {
      chars[i] = chars[i].toUpperCase()
    }
    if ((hashed[i >> 1] & 0x0f) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase()
    }
  }

  return '0x' + chars.join('')
}

module.exports = address

console.log(address.getAddress('xdcE097d6B3100777DC31B34dC2c58fB524C2e76921'))

console.log(address.isAddress('xdcE097d6B3100777DC31B34dC2c58fB524C2e76921'))
