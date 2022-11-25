import { Box, Text, HStack, Icon, FlatList, Pressable } from 'native-base'
import { RefreshControl } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'

import { FeatureHomeCard, TransactionItem } from 'xdapp/components'

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false)
  const totalBalance = 0.0

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    wait(2000).then(async () => {
      setRefreshing(false)
    })
  }, [])

  const transactions = [
    {
      tx: '0x6725',
      title: 'Added money',
      date: '20 Jun, 11:56',
      token: 'USxD',
      amount: '10',
      credited: true,
    },
    {
      tx: '0x6730',
      title: 'Withdrew money',
      date: '20 Jun, 11:56',
      token: 'USxD',
      amount: '10',
      credited: false,
    },
    {
      tx: '0x6735',
      title: 'Added money',
      date: '20 Jun, 11:56',
      token: 'USxD',
      amount: '10',
      credited: true,
    },
  ]

  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <FlatList
        width="95%"
        data={transactions}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <FeatureHomeCard
              balance={totalBalance.toFixed(4).toString()}
              apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
              // expScreen="DummyModal"
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="text.50" mr="1" />,
                name: 'Deposit',
                screen: 'DummyModal',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="text.50" mr="1" />,
                name: 'Transfer',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            {transactions.length > 0 ? (
              <HStack justifyContent="space-between" mx={4} mt={3} mb={2}>
                <Text fontWeight="medium" color="blueGray.600">
                  Transactions
                </Text>
                <Pressable onPress={() => navigation.navigate('DummyModal')}>
                  <Text fontWeight="medium" color="primary.400">
                    See all
                  </Text>
                </Pressable>
              </HStack>
            ) : null}
          </>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index == 0 ? '2xl' : 'md'}
            roundedBottom={index == transactions.length - 1 ? '2xl' : 'md'}
            mt={1}
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
        keyExtractor={(item) => item.tx}
      />
    </Box>
  )
}
