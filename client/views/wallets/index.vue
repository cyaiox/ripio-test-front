<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">      
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
                <h4 class="title">Wallets</h4>
            </div>
            <div class="column is-one-fifth">
              <button class="button is-primary" @click="newWallet">New Wallet</button>
            </div>
            
          </div>
          <section>
            <b-table
              :data="wallets"
              :loading="loading"
              striped>

              <template slot-scope="props">
                  <b-table-column field="id" label="Wallet" sortable>
                      <strong>{{ props.row.id }}</strong>
                  </b-table-column>

                  <b-table-column field="balance" label="Balance" sortable>
                      {{ props.row.balance }}
                  </b-table-column>

                  <b-table-column field="coin.name" label="Coin" sortable>
                      {{ props.row.coin.name.toUpperCase() }} - {{ props.row.coin.symbol }}
                  </b-table-column>
              </template>

              <template slot="empty">
                <div class="has-text-centered">
                  <b>The account doesn't cointain any wallet.</b>
                </div>
              </template>
            </b-table>
          </section>
        </article>
      </div>
    </div>

    <new-wallet :visible="openNewWallet" 
                :coins="coins"
                @close="closeNewWallet">
    </new-wallet>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Notification from 'vue-bulma-notification'
  import NewWallet from './NewWallet'

  const NotificationComponent = Vue.extend(Notification)

  const api = 'http://localhost:8000'

  const openNotification = (propsData = {
    title: '',
    message: '',
    type: '',
    direction: '',
    duration: 4500,
    container: '.notifications'
  }) => {
    return new NotificationComponent({
      el: document.createElement('div'),
      propsData
    })
  }

  export default {
    components: {
      NewWallet
    },

    data () {
      return {
        coins: [],
        wallets: [],
        loading: false,
        openNewWallet: false
      }
    },

    beforeCreate () {
      const loading = this.$loading.open({
        container: null
      })

      this.$http({
        url: `${api}/coins/`
      }).then((response) => {
        response.data.forEach(coin => this.coins.push(coin))

        loading.close()
      }).catch((error) => {
        throw error
      })
    },

    mounted () {
      this.loadWallets()
    },

    methods: {
      loadWallets () {
        this.loading = true

        this.wallets = []

        this.$http({
          url: `${api}/balance/wallets/`
        }).then((response) => {
          response.data.forEach(wallet => this.wallets.push(wallet))

          this.loading = false
        }).catch((error) => {
          throw error
        })
      },

      newWallet () {
        this.openNewWallet = true
      },

      closeNewWallet (coin) {
        if (coin !== null) {
          this.$http({
            method: 'POST',
            url: `${api}/balance/wallet/`,
            data: coin
          }).then((response) => {
            if (!response.data.hasOwnProperty('error')) {
              openNotification({
                message: 'Your wallet has been created successfully.',
                type: 'success',
                duration: 3000
              })
              this.loadWallets()
            } else {
              openNotification({
                message: 'The wallet cannot be created.',
                type: 'danger',
                duration: 3000
              })
            }
          }).catch((error) => {
            openNotification({
              message: 'The wallet cannot be created.',
              type: 'danger',
              duration: 3000
            })
            throw error
          })
        }

        this.openNewWallet = false
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
