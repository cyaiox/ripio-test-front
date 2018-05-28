import lazyLoading from './lazyLoading'

export default {
  path: '/balance',
  name: 'Balance',
  meta: {
    auth: true,
    icon: 'fa-chart-area',
    expanded: false,
    label: 'Balance'
  },
  component: lazyLoading('balance', true)
}
