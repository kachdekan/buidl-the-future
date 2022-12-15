import { Box, FlatList, Text } from 'native-base'
import { RefreshControl } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { SectionHeader, PopularItem, FeatureItem } from 'xdapp/components'

export default function PersonalSpacesScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    wait(2000).then(async () => {
      setRefreshing(false)
    })
  }, [])

  const myspaces = [
    {
      id: 'Ax675',
      initiated: true,
      title: 'School Fees',
      screen: 'DummyModal',
      amount: '500',
      dueDate: '22nd Dec 2022',
      paid: '300',
    },
    {
      id: 'Ax676',
      initiated: true,
      title: 'Toyota 110',
      screen: 'DummyModal',
      amount: '2500',
      dueDate: '2nd Jan 2023',
      paid: '2000',
    },
    {
      id: 'Ax677',
      initiated: true,
      title: 'Sherehe',
      screen: 'DummyModal',
      amount: '200',
      dueDate: '22nd Dec 2022',
      paid: '100',
    },
  ]
  const popularItems = [
    {
      id: 'Ax675',
      title: 'School Fees',
      desc: 'Avoid Last minute hustles',
      targetAmt: '$500.00',
      imgLink: 'https://source.unsplash.com/OBOf5-ZkBA8',
    },
    {
      id: 'Ax676',
      title: 'Daily Ride',
      desc: 'Add convinince to life',
      targetAmt: '$3500.00',
      imgLink: 'https://source.unsplash.com/3ZUsNJhi_Ik',
    },
    {
      id: 'Ax677',
      title: 'Emergency Kitty',
      desc: 'Prepare for the rainy days',
      targetAmt: '$2500.00',
      imgLink: 'https://source.unsplash.com/mODxn7mOzms',
    },
    {
      id: 'Ax678',
      title: 'Medical Bills',
      desc: 'Prepare for medical emergencies',
      targetAmt: '$500.00',
      imgLink: 'https://source.unsplash.com/k7ll1hpdhFA',
    },
    {
      id: 'Ax679',
      title: 'Vacation',
      desc: 'Relax in Zanzibar or Malindi',
      targetAmt: '$1200.00',
      imgLink: 'https://source.unsplash.com/SU0aGE7bINM',
    },
  ]
  return (
    <Box flex={1} bg="primary.50">
      <FlatList
        data={myspaces}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <SectionHeader title="Popular Savings" screen="DummyModal" link="Create New" />
            <FlatList
              data={popularItems}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              my={1}
              renderItem={({ item, index }) => (
                <Box ml={index == 0 ? 2 : 1} mr={index == 2 ? 2 : 1}>
                  <PopularItem
                    title={item.title}
                    desc={item.desc}
                    targetAmt={item.targetAmt}
                    imgLink={item.imgLink}
                    iconName="lock-clock"
                    screen="DummyModal"
                  />
                </Box>
              )}
              keyExtractor={(item) => item.id}
            />
            <SectionHeader title="My Savings" screen="DummyModal" link="See All" />
          </>
        }
        renderItem={({ item, index }) => (
          <Box
            width="95%"
            mx="2.5%"
            bg="white"
            opacity={85}
            roundedTop={index == 0 ? '2xl' : 'md'}
            roundedBottom={index == myspaces.length - 1 ? '2xl' : 'md'}
            mt={1}
            borderWidth={1}
            borderColor="gray.100"
          >
            <FeatureItem
              initiated={item.initiated}
              itemTitle={item.title}
              dueDate={item.dueDate}
              value={item.amount + ' USxD'}
              payProgress={item.paid + ' / ' + item.amount + ' saved'}
              screen="DummyModal"
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  )
}
