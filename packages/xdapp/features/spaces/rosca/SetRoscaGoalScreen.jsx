import {
  Box,
  Text,
  VStack,
  Spacer,
  Button,
  Stack,
  HStack,
  Input,
  Pressable,
  Actionsheet,
  useDisclose,
  FlatList,
  Modal,
  Icon,
} from 'native-base'

import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'

//import {
//getRoscaData,
//setCtbSchedule,
//setDisbSchedule,
//setGoalAmount,
//setUserSpaces,
//} from './spacesSlice'
//import celoHelper from '../../blockchain/helpers/celoHelper'
//import { config } from '../../blockchain/configs/celo.config'
//import { spacesIface } from '../../blockchain/contracts'
import { utils } from 'ethers'
import { ScheduleActSheet, SuccessModal } from 'xdapp/components'

export default function SetRoscaGoalScreen({ navigation, route }) {
  //const dispatch = useDispatch()
  //const spaceInfo = useSelector((state) => state.spaces.spaceInfo)
  const [newRosca, setNewRosca] = useState({ address: '' })
  const [amount, setAmount] = useState('0')
  const { isOpen, onOpen, onClose } = useDisclose()
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclose()
  const [isSetCtb, setIsSetCtb] = useState(false)
  const [schedule, setSchedule] = useState({
    day: 'Monday', //spaceInfo.ctbDay,
    occurrence: 'Weekly', //spaceInfo.ctbOccurence,
  })

  const [isLoading, setIsLoading] = useState(false)
  //const userAddress = useSelector((s) => s.wallet.walletInfo.address)
  const members = ['karanja', 'marion'] //useSelector((state) => state.spaces.spaceInfo.members)
  /*const createRosca = async () => {
    setIsLoading(true)
    const ctbAmount = utils.parseEther(spaceInfo.ctbAmount.toString()).toString()
    const goalAmount = utils.parseEther(spaceInfo.goalAmount.toString()).toString()
    let results
    const imageLink = 'https://source.unsplash.com/ybPJ47PMT_M'
    try {
      let txData = {
        token: config.contractAddresses['StableToken'],
        roscaName: spaceInfo.name,
        imageLink,
        authCode: spaceInfo.authCode,
        goalAmount,
        ctbAmount,
        ctbDay: spaceInfo.ctbDay,
        ctbOccur: spaceInfo.ctbOccurence,
        disbDay: spaceInfo.disbDay,
        disbOccur: spaceInfo.disbOccurence,
      }
      const txReceipt = await celoHelper.smartContractCall('Spaces', {
        method: 'createRosca',
        methodType: 'write',
        params: [Object.values(txData)],
      })
      handleTxResponce(txReceipt)
    } catch (e) {
      console.log(e)
    }
  }

  const handleTxResponce = (txReceipt) => {
    setIsLoading(false)
    const { data, topics } = txReceipt.logs.find(
      (el) => el.address === config.contractAddresses['Spaces'],
    )
    const results = spacesIface.parseLog({ data, topics })
    if (results) {
      const roscaDetails = {
        address: results.args.roscaAddress,
        roscaName: results.args[2][1],
        goalAmount: utils.formatUnits(results.args[2][4], 'ether'),
        goalAmountPaid: 0,
        ctbDay: results.args[2][6],
        ctbOccur: results.args[2][7],
      }
      setNewRosca(roscaDetails)
      dispatch(setUserSpaces(results.args.roscaAddress))
      onOpen1()
    }
  } */

  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <VStack space={3}>
        <Text mx={6} mt={8}>
          Set an amount and contribution and disbursment schedule
        </Text>
        <Stack mx={2} space={1}>
          <Box bg="white" roundedTop="xl" roundedBottom="md" borderWidth={1} borderColor="gray.100">
            <HStack m={3} space="xl">
              <Text fontSize="lg" py={3} pl={4} fontWeight="semibold">
                cUSD
              </Text>
              <Input
                py={2}
                textAlign="right"
                minW="2/3"
                placeholder="0.00"
                size="lg"
                keyboardType="numeric"
                InputRightElement={
                  <Text fontSize="md" fontWeight="medium" pr={3}>
                    cUSD
                  </Text>
                }
                value={amount}
                onChangeText={(amount) => setAmount(amount)}
                //onClose={() => dispatch(setGoalAmount(amount))}
                //onSubmitEditing={() => dispatch(setGoalAmount(amount))}
              />
            </HStack>
            <Text px={5} mb={3}>
              Each member contributes:{' '}
              {members.length > 0 ? (amount / members.length).toFixed(2).toString() : 'some'} cUSD
            </Text>
          </Box>
          <HStack
            bg="white"
            py={3}
            px={4}
            justifyContent="space-between"
            rounded="md"
            borderWidth={1}
            borderColor="gray.100"
          >
            <Text fontSize="md">Contribution Schedule:</Text>
            <Pressable onPress={onOpen} onPressOut={() => setIsSetCtb(true)}>
              {false ? (
                <Text color="primary.600" fontSize="md">
                  Weekly on Mon
                </Text>
              ) : (
                <Text color="primary.600" fontSize="md">
                  Everyday
                </Text>
              )}
            </Pressable>
          </HStack>
          <HStack
            bg="white"
            p={4}
            pt={3}
            justifyContent="space-between"
            roundedTop="md"
            roundedBottom="xl"
            borderWidth={1}
            borderColor="gray.100"
          >
            <Text fontSize="md">Disbursment Schedule:</Text>
            <Pressable onPress={onOpen} onPressOut={() => setIsSetCtb(false)}>
              {false ? (
                <Text color="primary.600" fontSize="md">
                  Weekly on Tue
                </Text>
              ) : (
                <Text color="primary.600" fontSize="md">
                  Everyday
                </Text>
              )}
            </Pressable>
          </HStack>
        </Stack>
        <ScheduleActSheet
          isOpen={isOpen}
          onClose={onClose}
          schedule={schedule}
          setSchedule={setSchedule}
          isSetCtb={isSetCtb}
        />
        <SuccessModal
          isOpen={isOpen1}
          onClose={onClose1}
          message="Rosca created successfully!"
          screen="RoscaHome"
          scrnOptions={{ roscaAddress: newRosca.address }}
        />
        <Spacer />
        <Stack alignItems="center" space={3} mb={8}>
          <Button
            variant="subtle"
            rounded="3xl"
            bg="primary.100"
            w="60%"
            _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
          >
            Skip
          </Button>
          <Button
            isLoading={isLoading}
            isLoadingText="Submitting"
            rounded="3xl"
            w="60%"
            _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => {
              //createRosca()
              //dispatch(setUserSpaces(userAddress))
            }}
          >
            Continue
          </Button>
        </Stack>
      </VStack>
    </Box>
  )
}
