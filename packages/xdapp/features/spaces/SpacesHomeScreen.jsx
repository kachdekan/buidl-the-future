import { Box, Text, FlatList, Icon, HStack, VStack, Avatar, Stack, Pressable } from 'native-base'
import { useState, useEffect, useCallback } from 'react'
import { RefreshControl } from 'react-native'
import { FeatureHomeCard, FeatureItem } from 'xdapp/components'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { fetchSpaces, setUserSpaces, updateSpaces } from './spacesSlice'
import { smartContractCall } from 'xdapp/blockchain/blockchainHelper'
import { getSpaces } from './spacesManager'

export default function SpacesHomeScreen({ navigation }) {
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)
  const [spaces, setSpaces] = useState([])
  const [challenges, setChallenges] = useState([])
  const [groups, setGroups] = useState([])
  const [personal, setPersonal] = useState([])
  let totalBalance = 0
  let groupsBal = 0
  let challengesBal = 0
  let personalBal = 0
  useEffect(() => {
    const fetchMySpaces = async () => {
      const mySpaces = await smartContractCall('Spaces', {
        method: 'getMySpaces',
        methodType: 'read',
      })
      const results = await getSpaces()
      setSpaces(results)
      dispatch(setUserSpaces(results))
      const roscas = results.filter((s) => s.type === 'rosca')
      setGroups(roscas)
      const personal = results.filter((s) => s.type === 'personal')
      setPersonal(personal)
      const challenges = results.filter((s) => s.type === 'challenge')
      setChallenges(challenges)
      for (const idx in mySpaces) {
        if (!results.find((ln) => ln.address === mySpaces[idx][0])) {
          //console.log(mySpaces[idx])
          dispatch(fetchSpaces())
          return
        }
      }
    }

    const unsubscribe = navigation.addListener('focus', () => {
      fetchMySpaces()
    })

    return unsubscribe
  }, [navigation])

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }
  /*
  useEffect(() => {
    dispatch(fetchSpaces())
  }, []) */

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    dispatch(fetchSpaces())
    wait(2000).then(async () => {
      const results = await getSpaces()
      setSpaces(results)
      dispatch(setUserSpaces(results))
      const roscas = results.filter((s) => s.type === 'rosca')
      setGroups(roscas)
      const personal = results.filter((s) => s.type === 'personal')
      setPersonal(personal)
      const challenges = results.filter((s) => s.type === 'challenge')
      setChallenges(challenges)
      setRefreshing(false)
    })
  }, [])

  if (spaces.length > 0) {
    spaces.forEach((space) => {
      totalBalance += space.repaid * 1
    })
    wait(1000).then(() => dispatch(updateSpaces()))
  }
  //Calc segmented balances
  if (groups.length > 0) {
    groups.forEach((space) => {
      groupsBal += space.repaid * 1
    })
  }
  if (challenges.length > 0) {
    challenges.forEach((space) => {
      challengesBal += space.repaid * 1
    })
  }
  if (personal.length > 0) {
    personal.forEach((space) => {
      personalBal += space.repaid * 1
    })
  }
  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <FlatList
        width="95%"
        data={spaces}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <FeatureHomeCard
              balance={totalBalance.toFixed(4).toString()}
              apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
              // expScreen="DummyModal"
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="text.50" mr="1" />,
                name: 'New Space',
                screen: 'createSpace',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-up-right" size="md" color="text.50" mr="1" />,
                name: 'Fund',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
          </>
        }
        ListFooterComponent={
          <>
            <HStack mx={1} justifyContent="space-between" my={4}>
              <Pressable
                width="48%"
                onPress={() => navigation.navigate('MySpaces', { screen: 'Challenges' })}
              >
                <VStack
                  bg="white"
                  space="6"
                  p={4}
                  borderRadius="2xl"
                  borderWidth={2}
                  borderColor="gray.100"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Avatar bg="violet.500">
                      <Icon as={MaterialIcons} name="bubble-chart" size="2xl" color="text.50" />
                    </Avatar>
                    <VStack>
                      <Text fontSize="md" alignSelf="flex-end">
                        ${challengesBal.toFixed(2)}
                      </Text>
                      <Text alignSelf="flex-end">≈ ks{(challengesBal * 120.75).toFixed(0)}</Text>
                    </VStack>
                  </HStack>
                  <Stack>
                    <Text fontSize="md" fontWeight="medium">
                      Challenges
                    </Text>
                    <Text color="muted.500">Be competitive</Text>
                  </Stack>
                </VStack>
              </Pressable>
              <Pressable
                width="48%"
                onPress={() => navigation.navigate('MySpaces', { screen: 'Personal' })}
              >
                <VStack
                  bg="white"
                  space="6"
                  p={4}
                  borderRadius="2xl"
                  borderWidth={2}
                  borderColor="gray.100"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Avatar bg="teal.500">
                      <Icon as={MaterialIcons} name="lock-clock" size="xl" color="text.50" />
                    </Avatar>
                    <VStack>
                      <Text fontSize="md" alignSelf="flex-end">
                        ${personalBal.toFixed(2)}
                      </Text>
                      <Text alignSelf="flex-end">≈ ks{(personalBal * 120.75).toFixed(0)}</Text>
                    </VStack>
                  </HStack>
                  <Stack>
                    <Text fontSize="md" fontWeight="medium">
                      Personal
                    </Text>
                    <Text color="muted.500">Save for a goal</Text>
                  </Stack>
                </VStack>
              </Pressable>
            </HStack>
            <HStack mx={1} justifyContent="space-between" mb={4}>
              <Pressable
                width="48%"
                onPress={() => navigation.navigate('MySpaces', { screen: 'Groups' })}
              >
                <VStack
                  bg="white"
                  space="6"
                  p={4}
                  borderRadius="2xl"
                  borderWidth={2}
                  borderColor="gray.100"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Avatar bg="green.500">
                      <Icon as={MaterialIcons} name="groups" size="xl" color="text.50" />
                    </Avatar>
                    <VStack>
                      <Text fontSize="md" alignSelf="flex-end">
                        ${groupsBal.toFixed(2)}
                      </Text>
                      <Text alignSelf="flex-end">≈ ks{(groupsBal * 120.75).toFixed(0)}</Text>
                    </VStack>
                  </HStack>
                  <Stack>
                    <Text fontSize="md" fontWeight="medium">
                      Groups
                    </Text>
                    <Text color="muted.500">Save with friends</Text>
                  </Stack>
                </VStack>
              </Pressable>
              <Pressable width="48%" onPress={() => navigation.navigate('DummyModal')}>
                <VStack
                  bg="white"
                  space="6"
                  p={4}
                  borderRadius="2xl"
                  borderWidth={2}
                  borderColor="gray.100"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Avatar bg="yellow.500">
                      <Icon as={MaterialIcons} name="group-add" size="xl" color="text.50" />
                    </Avatar>
                    <Text fontSize="md">0</Text>
                  </HStack>
                  <Stack>
                    <Text fontSize="md" fontWeight="medium">
                      Invites
                    </Text>
                    <Text color="muted.500">Join your crew</Text>
                  </Stack>
                </VStack>
              </Pressable>
            </HStack>
          </>
        }
      />
    </Box>
  )
}
