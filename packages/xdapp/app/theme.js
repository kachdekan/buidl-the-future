import { extendTheme } from 'native-base'

export const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
  },
  components: {
    Button: {
      // Can simply pass default props to change default behaviour of components.
      sizes: {
        sm: {
          px: '4',
          py: '3',
          _text: {
            fontSize: 'sm',
          },
          _icon: {
            size: 'md',
          },
        },
      },
      defaultProps: {
        size: 'sm',
        colorScheme: 'warmGray',
      },
    },
  },
})
