import { Box, Spinner, Text } from 'native-base'

export default function LoaderScreen() {
  return (
    <Box flex={1} bg="primary.50" alignItems="center" justifyContent="center">
      <Spinner size="lg" />
      <Text>Wallet loading...</Text>
    </Box>
  )
}
