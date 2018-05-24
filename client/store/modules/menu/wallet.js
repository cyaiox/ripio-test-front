import lazyLoading from './lazyLoading'

export default {
  path: '/wallet',
  meta: {
    auth: true,
    icon: 'fa-wallet',
    expanded: false,
    label: 'Wallets'
  },
  component: lazyLoading('wallets', true)
}
