export default {
  content: [
    './pages/**/*.vue',
    './components/**/*.vue',
    './layouts/**/*.vue',
    './plugins/**/*.js',
    './server/*.js'
    // Add other relevant paths
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'misty-rose': '#F7D7D1',
        'black-bean': '#34171C',
        zomp: '#54A18F',
        moonstone: '#3DB9D0',
        'electric-blue': '#30E2F7'
      }
    }
  },
  plugins: []
}
