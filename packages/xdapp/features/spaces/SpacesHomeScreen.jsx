import { Box, Text, FlatList, Icon, HStack, VStack, Avatar, Stack } from 'native-base'
import { useState, useEffect, useCallback } from 'react'
import { RefreshControl } from 'react-native'
import { FeatureHomeCard, FeatureItem } from 'xdapp/components'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function SpacesHomeScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const totalBalance = 0

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    wait(2000).then(async () => {
      setRefreshing(false)
    })
  }, [])
  const spaces = []
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
            {spaces.length > 0 ? (
              <HStack justifyContent="space-between" mx={4} mt={3} mb={1}>
                <Text fontWeight="medium" color="blueGray.600">
                  Spaces
                </Text>
                <Text color="primary.600">See all</Text>
              </HStack>
            ) : null}
          </>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index == 0 ? '2xl' : 'md'}
            roundedBottom={index == spaces.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <FeatureItem
              initiated={true}
              itemTitle="Masomo"
              payProgress={
                (item.repaid * 1).toFixed(2).toString() +
                '/' +
                (item.value * 1).toFixed(2).toString() +
                ' Paid'
              }
              value={(item.value * 1).toFixed(2).toString() + ' cUSD'}
              dueDate={'Due: ' + '2nd Dec 2022'}
              screen="RoscaHome"
              itemParams={{ roscaAddress: item.addr }}
            />
          </Box>
        )}
        keyExtractor={(item) => item.addr}
        ListFooterComponent={
          <>
            <HStack mx={1} justifyContent="space-between" my={4}>
              <VStack
                bg="white"
                width="48%"
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
                  <Text fontSize="md">$0.00</Text>
                </HStack>
                <Stack>
                  <Text fontSize="md" fontWeight="medium">
                    Challenges
                  </Text>
                  <Text color="muted.500">Be competitive</Text>
                </Stack>
              </VStack>
              <VStack
                bg="white"
                width="48%"
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
                  <Text fontSize="md">$0.00</Text>
                </HStack>
                <Stack>
                  <Text fontSize="md" fontWeight="medium">
                    Personal
                  </Text>
                  <Text color="muted.500">Save for a goal</Text>
                </Stack>
              </VStack>
            </HStack>
            <HStack mx={1} justifyContent="space-between" mb={4}>
              <VStack
                bg="white"
                width="48%"
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
                  <Text fontSize="md">$0.00</Text>
                </HStack>
                <Stack>
                  <Text fontSize="md" fontWeight="medium">
                    Groups
                  </Text>
                  <Text color="muted.500">Save with friends</Text>
                </Stack>
              </VStack>
              <VStack
                bg="white"
                width="48%"
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
            </HStack>
          </>
        }
      />
    </Box>
  )
}
