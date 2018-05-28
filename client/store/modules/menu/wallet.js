import lazyLoading from './lazyLoading'

export default {
  path: '/wallet',
  name: 'Wallet',
  meta: {
    auth: true,
    icon: 'fa-wallet',
    expanded: false,
    label: 'Wallets'
  },
  component: lazyLoading('wallets', true)
}
