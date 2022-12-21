import { Text, Stack, VStack, Pressable, Image, AspectRatio, Box } from 'native-base'
import { useNavigation } from '@react-navigation/native'

const NewsItem = (props) => {
  const navigation = useNavigation()
  return (
    <Pressable onPress={() => navigation.navigate('DummyModal')}>
      <VStack pb={3} space={3} rounded="2xl" w="170" bg="white">
        <Box>
          <AspectRatio
            ratio={{
              base: 4 / 3,
            }}
          >
            <Image
              source={{
                uri: props.imgLink,
              }}
              roundedTop="2xl"
              alt="spaces"
            />
          </AspectRatio>
          <Text
            position="absolute"
            bottom={0}
            bg="warmGray.500"
            ellipsizeMode="tail"
            numberOfLines={2}
            color="text.50"
            p={3}
          >
            {props.title}
          </Text>
        </Box>
        <Stack px={3}>
          <Text fontSize="xs" color="warmGray.500">
            {props.time} - {props.publisher}
          </Text>
        </Stack>
      </VStack>
    </Pressable>
  )
}

export default NewsItem
