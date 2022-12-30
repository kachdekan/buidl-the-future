import {
  Box,
  Text,
  Image,
  HStack,
  Button,
  Spacer,
  VStack,
  Progress,
  Avatar,
  Spinner,
  Icon,
  FlatList,
} from 'native-base'
import { Feather } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import { useLayoutEffect, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRoscaData } from '../spacesSlice'
import { TransactionItem } from 'xdapp/components'
import { useGetTokenTransfersQuery, useGetTxsByAddrQuery } from '../../../app/services/blockscout'
import { utils } from 'ethers'
import { areAddressesEqual, shortenAddress } from 'xdapp/utils/addresses'

export default function RoscaHomeScreen({ navigation, route }) {
  const roscaAddress = route.params.roscaAddress
  //console.log(roscaAddress)
  const dispatch = useDispatch()
  const { roscaDetails } = useSelector((state) => state.spaces)
  const {
    data: txData,
    error: txError,
    isLoading: txIsLoading,
  } = useGetTokenTransfersQuery(roscaAddress.replace('0x', 'xdc'))
  const [transactions, setTransactions] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    dispatch(getRoscaData(roscaAddress))
  }, [])
  useEffect(() => {
    if (txData) handleGetTransactions()
  }, [txData])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => {
        return (
          <HeaderBackButton
            {...props}
            onPress={() => {
              navigation.navigate('MySpaces', { screen: 'Groups' })
            }}
          />
        )
      },
    })
  }, [navigation])

  const prog = (roscaDetails.roscaBal / roscaDetails.goalAmount) * 100
  const dueAmount = (roscaDetails.goalAmount * 1) / (roscaDetails.activeMembers * 1)

  const handleGetTransactions = () => {
    const thisTxs = []
    const goodTxs = Array.prototype.filter.call(
      txData.items,
      (txs) => txs.value.toString() * 1 >= utils.parseUnits('0.0008', txs.decimals).toString() * 1,
    )
    goodTxs.forEach((tx) => {
      const txDate = new Date(tx.timestamp)
      const date = txDate.toDateString().split(' ')
      const txItem = {
        id: tx._id,
        credited: areAddressesEqual(tx.to.replace('xdc', '0x'), roscaAddress) ? true : false,
        title: areAddressesEqual(tx.to.replace('xdc', '0x'), roscaAddress)
          ? shortenAddress(tx.from.replace('xdc', '0x'), true)
          : shortenAddress(tx.to.replace('xdc', '0x'), true),
        date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
        amount: utils.formatUnits(tx.value, tx.decimals),
        token: tx.symbol,
      }
      thisTxs.push(txItem)
    })
    setTransactions(thisTxs)
  }

  if (!roscaDetails) {
    return <Spinner size="lg" />
  }
  return (
    <Box flex={1} bg="primary.50">
      <Image
        source={{
          uri: roscaDetails.imgLink,
        }}
        alt="Your groups photo"
        height="35%"
        minH={240}
      />
      <Box position="absolute" top="11%" left={3}>
        <Box bg="rgba(52, 52, 52, 0.3)" minW="2/3" rounded="lg">
          <Box p={3} minW="2/3">
            <Text fontSize="md" fontWeight="medium" color="white" lineHeight="xs">
              Balance (UxSD)
            </Text>
            <Text fontSize="3xl" fontWeight="semibold" color="white">
              {roscaDetails.roscaBal}
            </Text>
            <Text fontSize="sm" color="white" lineHeight="xs">
              ≈ {(roscaDetails.roscaBal * 120.75).toFixed(2)} KES
            </Text>
          </Box>
        </Box>
        <HStack space={2} mt={3}>
          <Button
            leftIcon={<Icon as={Feather} name="plus" size="md" color="text.50" mr="1" />}
            rounded="3xl"
            pr="4"
            size="sm"
            _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => navigation.navigate('fundRound', { roscaAddress, dueAmount })}
          >
            Fund
          </Button>
          <Button
            leftIcon={
              <Icon as={Feather} name="arrow-down-right" size="md" color="text.50" mr="1" />
            }
            rounded="3xl"
            pr="4"
            size="sm"
            _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
          >
            Withdraw
          </Button>
          <Button
            leftIcon={<Icon as={Feather} name="more-horizontal" size="md" color="text.50" mx="2" />}
            rounded="3xl"
            pr="4"
            size="sm"
            _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
          />
        </HStack>
      </Box>
      <Box alignItems="center" mt={3}>
        <HStack mx="8" my="2">
          <Text fontWeight="medium" color="blueGray.600">
            Round: {roscaDetails.currentRound}
          </Text>
          <Spacer />
          <Text _light={{ color: 'primary.600' }} fontWeight="medium">
            Due for: {roscaDetails.creator ? roscaDetails.creator.slice(0, 6) : 'Next'}
          </Text>
        </HStack>
        <Box bg="white" roundedTop="xl" roundedBottom="md" width="95%">
          <VStack space={2}>
            <HStack mx="5" my="2">
              <Text fontWeight="semibold" fontSize="md">
                Saved: {prog.toFixed(1)}%
              </Text>
              <Spacer />
              <Text _light={{ color: 'muted.500' }} fontWeight="medium" pt={1}>
                {roscaDetails.roscaBal} / {roscaDetails.goalAmount}
              </Text>
            </HStack>
            <Progress colorScheme="primary" value={prog} mx="4" bg="primary.100" />
            <HStack mx="5" my="2">
              <Text fontWeight="medium" color="muted.500">
                Due: {roscaDetails.dueDate}
              </Text>
              <Spacer />
              <Text _light={{ color: 'muted.500' }} fontWeight="medium">
                2/5 Contributions
              </Text>
            </HStack>
          </VStack>
        </Box>
        <Box bg="white" roundedTop="md" roundedBottom="xl" width="95%" mt={1}>
          <HStack mx="5" my="2" pb={1}>
            <Text fontWeight="medium" fontSize="md" color="blueGray.600">
              Your Contribution
            </Text>
            <Spacer />
            <Text _light={{ color: 'primary.600' }} fontWeight="medium" py={1}>
              {roscaDetails.roscaBal}/
              {(roscaDetails.goalAmount * 1) / (roscaDetails.activeMembers * 1)} cUSD
            </Text>
          </HStack>
        </Box>
      </Box>
      <Box alignItems="center" mt={3}>
        <HStack mx="8" my="2">
          <Text fontWeight="medium" color="blueGray.600">
            Transactions
          </Text>
          <Spacer />
          <Text _light={{ color: 'primary.600' }} fontWeight="medium">
            See all
          </Text>
        </HStack>
        <FlatList
          //width="95%"
          data={transactions.slice(0, 6)}
          showsHorizontalScrollIndicator={false}
          mt={1}
          mb={4}
          //keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Box
              width="95%"
              mx="2.5%"
              bg="white"
              opacity={85}
              roundedTop={index == 0 ? '2xl' : 'md'}
              roundedBottom={index == transactions.length - 1 ? '2xl' : 'md'}
              mt={1}
              //key={index.toString()}
            >
              <TransactionItem
                credited={item.credited}
                trTitle={item.title}
                trDate={item.date}
                spAmount={
                  (item.credited ? '+' : '-') + (item.amount * 1).toFixed(2) + ' ' + item.token
                }
                eqAmount={(item.amount * 120.75).toFixed(2) + ' KES'}
                screen="DummyModal"
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  )
}
