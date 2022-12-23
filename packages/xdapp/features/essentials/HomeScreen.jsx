import { Box, Text, HStack, Icon, FlatList, Pressable } from 'native-base'
import { RefreshControl } from 'react-native'
import { utils } from 'ethers'
import { useState, useEffect, useCallback } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { NativeTokensByAddress } from '../wallet/tokens'
import { fetchBalances } from '../wallet/walletSlice'
import { FeatureHomeCard, TransactionItem, NewsItem } from 'xdapp/components'
import { useGetTokenTransfersQuery, useGetTxsByAddrQuery } from '../../app/services/blockscout'
import { useGetLatestNewsQuery } from '../../app/services/newsdata'
import { shortenAddress, areAddressesEqual } from 'xdapp/utils/addresses'
import { getDaysBetween } from 'xdapp/utils/time'

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch()
  const walletAddress = useSelector((s) => s.wallet.walletInfo.address)
  const balances = useSelector((s) => s.wallet.walletBalances.tokenAddrToValue)
  const tokenAddrs = Object.keys(NativeTokensByAddress)
  const { isSignerSet } = useSelector((s) => s.essential)
  const [refreshing, setRefreshing] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [news, setNews] = useState([])
  const {
    data: txData,
    error: txError,
    isLoading: txIsLoading,
  } = useGetTokenTransfersQuery(walletAddress.replace('0x', 'xdc'))
  const { data: newsData, error: newsError } = useGetLatestNewsQuery('xdc')

  let totalBalance = 0
  const xdcInUsd = 0.028
  if (balances) {
    totalBalance = balances[tokenAddrs[1]] * 1 + balances[tokenAddrs[0]] * xdcInUsd
  }

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }

  useEffect(() => {
    if (!balances) {
      if (isSignerSet) {
        //handleGetBalances()
        dispatch(fetchBalances())
      }
    }
  }, [isSignerSet])

  useEffect(() => {
    if (txData) handleGetTransactions()
  }, [txData])

  useEffect(() => {
    if (newsData) handleGetNews()
  }, [newsData])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    dispatch(fetchBalances())
    wait(2000).then(async () => {
      if (txData) handleGetTransactions()
      setRefreshing(false)
    })
  }, [])

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
        credited: areAddressesEqual(tx.to.replace('xdc', '0x'), walletAddress) ? true : false,
        title: areAddressesEqual(tx.to.replace('xdc', '0x'), walletAddress)
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

  const handleGetNews = () => {
    const thisNews = []
    newsData.results.forEach((news, index) => {
      const [dateValues, timeValues] = news.pubDate.split(' ')
      const [year, month, day] = dateValues.split('-')
      const [hours, minutes, seconds] = timeValues.split(':')
      const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)
      const diff = getDaysBetween(date.getTime(), Date.now())
      const newsItem = {
        id: index,
        imgLink: news.image_url ? news.image_url : 'https://source.unsplash.com/WYd_PkCa1BY',
        title: news.title,
        time: diff < 1 ? news.pubDate.split(' ')[1].slice(0, 5) : `${diff}d ago`,
        publisher: news.source_id.charAt(0).toUpperCase() + news.source_id.slice(1),
        link: news.link,
      }
      thisNews.push(newsItem)
    })
    setNews(thisNews)
  }

  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <FlatList
        data={transactions.slice(0, 3)}
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
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="text.50" mr="1" />,
                name: 'Transfer',
                screen: 'sendFunds',
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
        keyExtractor={(item) => item.id}
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
        ListFooterComponent={
          <>
            {news.length > 0 ? (
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
            ) : null}
            <FlatList
              data={news.slice(0, 6)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              mt={1}
              mb={4}
              //keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Box
                  //key={index.toString()}
                  maxH="50%"
                  ml={index == 0 ? 2 : 1}
                  mr={index == news.slice(0, 6).length - 1 ? 2 : 1}
                >
                  <NewsItem
                    imgLink={item.imgLink}
                    title={item.title}
                    time={item.time}
                    publisher={item.publisher}
                    link={item.link}
                  />
                </Box>
              )}
            />
          </>
        }
      />
    </Box>
  )
}
