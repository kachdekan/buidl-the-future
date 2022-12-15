import { Text, Stack, VStack, Pressable, Image, AspectRatio } from 'native-base'
import { useNavigation } from '@react-navigation/native'

const NewsItem = (props) => {
  const navigation = useNavigation()
  return (
    <Pressable onPress={() => navigation.navigate('DummyModal')}>
      <VStack p={3} space={3} rounded="2xl" w="175" bg="white">
        <AspectRatio
          ratio={{
            base: 4 / 3,
          }}
        >
          <Image
            source={{
              uri: props.imgLink,
            }}
            rounded="xl"
            alt="spaces"
          />
        </AspectRatio>
        <Stack>
          <Text ellipsizeMode="tail" numberOfLines={2}>
            {props.title}
          </Text>
          <Text fontSize="xs" color="warmGray.500" mt={2}>
            {props.time} - {props.publisher}
          </Text>
        </Stack>
      </VStack>
    </Pressable>
  )
}

export default NewsItem
