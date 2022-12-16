import { Modal, Icon, Text, Button } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

const SuccessModal = ({ isOpen, onClose, message, screen, scrnOptions }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide">
      <Modal.Content width="65%" maxWidth="400px">
        <Modal.Body alignItems="center">
          <Icon as={Ionicons} name="md-checkmark-circle" size="6xl" color="success.600" />
          <Text textAlign="center" mt={3}>
            {message}
          </Text>
          <Button
            variant="subtle"
            rounded="3xl"
            w="60%"
            mt={3}
            _text={{ color: 'primary.600', fontWeight: 'semibold' }}
            onPress={() => {
              onClose(), navigation.navigate(screen, scrnOptions)
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default SuccessModal
