import lazyLoading from './lazyLoading'

export default {
  path: '/balance',
  meta: {
    auth: true,
    icon: 'fa-chart-area',
    expanded: false,
    label: 'Balance'
  },
  component: lazyLoading('balance', true)
}
