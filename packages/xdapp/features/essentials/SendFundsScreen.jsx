import {
  Box,
  FormControl,
  Text,
  VStack,
  Input,
  HStack,
  Button,
  Pressable,
  Spacer,
  useDisclose,
  Stack,
} from 'native-base'
import { useState, useRef } from 'react'
import { NativeTokens } from '../wallet/tokens'
import { transfer } from 'xdapp/blockchain/blockchainHelper'
import { utils } from 'ethers'
import { SuccessModal } from 'xdapp/components/'
import { shortenAddress } from 'xdapp/utils/addresses'

export default function SendFundsScreen({ navigation }) {
  const amtInputRef = useRef()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState('USxD')
  const { isOpen, onOpen, onClose } = useDisclose()
  const [isLoading, setIsLoading] = useState(false)
  const approxAmount = (+amount * 120.75).toFixed(2)
  let textSize = '5xl'
  if (amount.length > 6 && amount.length <= 8) {
    textSize = '4xl'
  } else if (amount.length >= 9) {
    textSize = '3xl'
  }

  const thisToken = NativeTokens.find((Token) => Token.symbol === token)
  const transferFunds = async () => {
    setIsLoading(true)
    try {
      const txReceipt = await transfer('StableToken', {
        recipientAddress: recipient,
        amount: amount,
      })

      handleTxReceipt(txReceipt)
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const handleTxReceipt = async (txReceipt) => {
    const thisLog = txReceipt.events.find((el) => el.event === 'Transfer')
    if (utils.formatUnits(thisLog.args[2], thisToken.decimals) == +amount) {
      onOpen()
      setIsLoading(false)
    }
  }

  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <VStack width="95%" mt={3} space={1}>
        <Box
          bg="white"
          p={3}
          roundedTop="2xl"
          roundedBottom="md"
          borderWidth={1}
          borderColor="gray.100"
        >
          <FormControl.Label px={3}>Recipient</FormControl.Label>
          <Input
            placeholder="address"
            size="md"
            mt={2}
            value={recipient}
            onChangeText={(text) => setRecipient(text)}
          />
        </Box>
        <VStack
          bg="white"
          p={3}
          roundedTop="md"
          roundedBottom="2xl"
          borderWidth={1}
          borderColor="gray.100"
          space={2}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <Text>Balance: 200 USxD</Text>
            <Button variant="subtle" size="sm" rounded="full" bg="primary.100">
              USXD &or;
            </Button>
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            <Button variant="subtle" size="sm" rounded="full">
              MAX
            </Button>
            <Input
              position="absolute"
              alignSelf="center"
              right="25%"
              width="50%"
              variant="unstyled"
              placeholder=""
              size="2xl"
              textAlign="center"
              style={{ color: 'white' }}
              mt={2}
              caretHidden={true}
              ref={amtInputRef}
              keyboardType="phone-pad"
              value={amount}
              onChangeText={(amount) => setAmount(amount)}
            />
            <Pressable onPress={() => amtInputRef.current.focus()} width="55%">
              <Text fontSize={textSize} fontWeight="bold" textAlign="center">
                {amount ? (+amount).toLocaleString() : '0.00'}
              </Text>
            </Pressable>
            <Button variant="subtle" size="sm" rounded="full">
              MAX
            </Button>
          </HStack>
          <Text alignSelf="center" fontSize="md">
            ≈ {approxAmount} KES
          </Text>
        </VStack>
      </VStack>
      <Spacer />
      <Button
        isDisabled={amount && recipient ? false : true}
        bg="warmGray.800"
        isLoading={isLoading}
        rounded="3xl"
        pr="4"
        width="75%"
        mb="12"
        _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
        onPress={() => transferFunds()}
      >
        Send
      </Button>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        message={`${(+amount).toFixed(2)} ${thisToken.symbol} \nsuccessfully sent to \n${
          recipient ? shortenAddress(recipient, true) : 'xdc0...000'
        }`}
        screen="Main"
      />
    </Box>
  )
}

const txRcpt = {
  blockHash: '0x9eeda6afc6ee2bc50d1e5a255ea0bcbcfe9234cc2c37ef3fadf4e2cf4f9d5322',
  blockNumber: 42963501,
  byzantium: true,
  confirmations: 2,
  contractAddress: null,
  cumulativeGasUsed: {
    hex: '0x01b9b9',
    type: 'BigNumber',
  },
  events: [
    {
      address: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      args: [
        '0x8E912eE99bfaECAe8364Ba6604612FfDfE46afd2',
        '0x61979179B0EFcad139Bf6AcAA32Ba7aF50e41BA1',
        {
          hex: '0x0f4240',
          type: 'BigNumber',
        },
      ],
      blockHash: '0x5b34dd9e3ab37dadf300fc40d44de3227462a33ec11816b6301cdb9a1e8a61c5',
      blockNumber: 42963501,
      data: '0x00000000000000000000000000000000000000000000000000000000000f4240',
      decode: [],
      event: 'Transfer',
      eventSignature: 'Transfer(address,address,uint256)',
      getBlock: [],
      getTransaction: [],
      getTransactionReceipt: [],
      logIndex: 4,
      removeListener: [],
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008e912ee99bfaecae8364ba6604612ffdfe46afd2',
        '0x00000000000000000000000061979179b0efcad139bf6acaa32ba7af50e41ba1',
      ],
      transactionHash: '0xf54827c8ac2bbe1bb671373812f4cee3728ecf8ac2edc61c0f5227751746c953',
      transactionIndex: 3,
    },
  ],
  from: '0x8E912eE99bfaECAe8364Ba6604612FfDfE46afd2',
  gasUsed: {
    hex: '0xa5e3',
    type: 'BigNumber',
  },
  logs: [
    {
      address: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      blockHash: '0x5b34dd9e3ab37dadf300fc40d44de3227462a33ec11816b6301cdb9a1e8a61c5',
      blockNumber: 42963501,
      data: '0x00000000000000000000000000000000000000000000000000000000000f4240',
      logIndex: 4,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008e912ee99bfaecae8364ba6604612ffdfe46afd2',
        '0x00000000000000000000000061979179b0efcad139bf6acaa32ba7af50e41ba1',
      ],
      transactionHash: '0xf54827c8ac2bbe1bb671373812f4cee3728ecf8ac2edc61c0f5227751746c953',
      transactionIndex: 3,
    },
  ],
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000020100000000002000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000081000000000000000000000000000000000000000000000000000000080000000000000000000000000000000010000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1,
  to: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
  transactionHash: '0xf54827c8ac2bbe1bb671373812f4cee3728ecf8ac2edc61c0f5227751746c953',
  transactionIndex: 3,
  type: 0,
}
