import { Box, VStack, Button, Heading, Spacer } from 'native-base'
export default function WelcomeScreen({ navigation }) {
  return (
    <Box flex={1} bg="primary.50" alignItems="center" justifyContent="flex-end">
      <Box width="75%" mt="3/4">
        <Heading textAlign="center" color="warmGray.800">
          Step into the future of money with xDapp
        </Heading>
      </Box>
      <Spacer />
      <VStack alignItems="center" space={3} mb="10">
        <Button
          bg="warmGray.800"
          rounded="3xl"
          pr="4"
          minW="75%"
          _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate('getUserDetails')}
        >
          Create New Account
        </Button>
        <Button
          variant="subtle"
          bg="primary.100"
          rounded="3xl"
          pr="4"
          minW="75%"
          _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate('importWallet')}
        >
          Use Existing Account
        </Button>
      </VStack>
    </Box>
  )
}
