import { Box, Text, HStack, Icon, FlatList, Pressable } from 'native-base'
import { RefreshControl } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'

import { FeatureHomeCard, TransactionItem, NewsItem } from 'xdapp/components'

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

  const news = [
    {
      id: 'Ax675',
      imgLink:
        'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      title: "Bitcoin's rocky road to becoming a risk-off asset: Analysts investigate",
      time: '16:07',
      publisher: 'The Cointelegraph',
      link: 'https://example.com',
    },
    {
      id: 'Ax680',
      imgLink:
        'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      title: "Bitcoin's rocky road to becoming a risk-off asset: Analysts investigate",
      time: '16:07',
      publisher: 'The Cointelegraph',
      link: 'https://example.com',
    },
    {
      id: 'Ax685',
      imgLink:
        'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      title: "Bitcoin's rocky road to becoming a risk-off asset: Analysts investigate",
      time: '16:07',
      publisher: 'The Cointelegraph',
      link: 'https://example.com',
    },
  ]

  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <FlatList
        data={transactions}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Box width="95%" mx="2.5%">
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
                <Text fontWeight="medium" color="warmGray.800">
                  Transactions
                </Text>
                <Pressable onPress={() => navigation.navigate('DummyModal')}>
                  <Text fontWeight="medium" color="primary.400">
                    See all
                  </Text>
                </Pressable>
              </HStack>
            ) : null}
          </Box>
        }
        renderItem={({ item, index }) => (
          <Box
            width="95%"
            mx="2.5%"
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
        ListFooterComponent={
          <>
            <Box width="95%" mx="2.5%">
              <HStack justifyContent="space-between" mx={4} mt={4} mb={2}>
                <Text fontWeight="medium" color="warmGray.800">
                  Some news for you
                </Text>
                <Pressable onPress={() => navigation.navigate('DummyModal')}>
                  <Text fontWeight="medium" color="primary.400">
                    Read all
                  </Text>
                </Pressable>
              </HStack>
            </Box>
            <FlatList
              data={news}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              mt={1}
              mb={4}
              renderItem={({ item, index }) => (
                <Box maxH="50%" ml={index == 0 ? 2 : 1} mr={index == 2 ? 2 : 1}>
                  <NewsItem
                    imgLink={item.imgLink}
                    title={item.title}
                    time={item.time}
                    publisher={item.publisher}
                    link={item.link}
                  />
                </Box>
              )}
              keyExtractor={(item) => item.id}
            />
          </>
        }
      />
    </Box>
  )
}
