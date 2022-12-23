import { Box, Text } from 'native-base'
import { Wallet, utils } from 'ethers'
import { getProvider } from '../../blockchain/provider'
import { transfer } from '../../blockchain/blockchainHelper'
import { useEffect } from 'react'

export default function ReviewTxScreen() {
  const provider = getProvider()
  useEffect(() => {
    async function feeData() {
      const txReceipt = await transfer('StableToken', {
        recipientAddress: '0x61979179B0EFcad139Bf6AcAA32Ba7aF50e41BA1',
        amount: 1,
      })
      console.log(txReceipt)
    }
    feeData()
  }, [])

  return (
    <Box flex={1} bg="primary.50" alignItems="center" justifyContent="center">
      <Text>Dummy Screen</Text>
    </Box>
  )
}
