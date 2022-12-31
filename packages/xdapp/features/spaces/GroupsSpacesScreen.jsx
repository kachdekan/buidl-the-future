import { Box, FlatList, Text } from 'native-base'
import { RefreshControl } from 'react-native'
import { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { SectionHeader, PopularItem, FeatureItem } from 'xdapp/components'
import { useSelector, useDispatch } from 'react-redux'
import { updateSpaces } from './spacesSlice'

export default function GroupsSpacesScreen() {
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)
  const myGroupsSpaces = useSelector((s) => s.spaces.userSpaces.roscas)
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    dispatch(updateSpaces())
    wait(2000).then(async () => {
      setRefreshing(false)
    })
  }, [])

  const popularItems = [
    {
      id: 'Ax675',
      title: 'School Fees',
      desc: 'Avoid Last minute hustles',
      targetAmt: '$500.00',
      members: '15',
    },
    {
      id: 'Ax676',
      title: 'Daily Ride',
      desc: 'Add convinince to life',
      targetAmt: '$3500.00',
      members: '10',
    },
    {
      id: 'Ax677',
      title: 'Emergency Kitty',
      desc: 'Prepare for the rainy days',
      targetAmt: '$2500.00',
      members: '5',
    },
    {
      id: 'Ax678',
      title: 'Medical Bills',
      desc: 'Prepare for medical emergencies',
      targetAmt: '$500.00',
      members: '12',
    },
    {
      id: 'Ax679',
      title: 'Vacation',
      desc: 'Relax in Zanzibar or Malindi',
      targetAmt: '$1200.00',
      members: '8',
    },
  ]

  const colors = ['blue', 'purple', 'violet', 'green', 'teal', 'rose']
  return (
    <Box flex={1} bg="primary.50">
      <FlatList
        data={myGroupsSpaces}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <SectionHeader title="Join a Group" screen="createSpace" link="Create New" />
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
                    memberCount={item.members}
                    iconName="groups"
                    bgColor={colors[Math.floor(Math.random() * colors.length)] + '.500'}
                    screen="DummyModal"
                  />
                </Box>
              )}
              keyExtractor={(item) => item.id}
            />
            <SectionHeader title="My Groups" screen="DummyModal" link="See All" />
          </>
        }
        renderItem={({ item, index }) => (
          <Box
            width="95%"
            mx="2.5%"
            bg="white"
            opacity={85}
            roundedTop={index == 0 ? '2xl' : 'md'}
            roundedBottom={index == myGroupsSpaces.length - 1 ? '2xl' : 'md'}
            mt={1}
            borderWidth={1}
            borderColor="gray.100"
          >
            <FeatureItem
              initiated={true}
              itemTitle={item.name}
              dueDate={item.dueDate}
              value={item.value + ' USxD'}
              payProgress={item.repaid + ' / ' + item.value + ' paid'}
              screen="RoscaHome"
              itemParams={{ roscaAddress: item.address }}
            />
          </Box>
        )}
        keyExtractor={(item) => item.address}
      />
    </Box>
  )
}
