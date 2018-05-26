<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <wallet-list v-model="selectedWallet"
                    :wallets="wallets" 
                    @input="selectWallet">
        </wallet-list>
      
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <h4 class="title">Balance</h4>
            </div>
            <div class="column is-one-fifth">
              <button class="button is-primary" @click="newTransaction">New Transaction</button>
            </div>
            
          </div>
          <section>
            <b-table
              :data="transactions"
              :loading="loading"
              striped>

              <template slot-scope="props">
                  <b-table-column field="date_time" label="Date" sortable>
                      {{ props.row.date_time | formatDate }}
                  </b-table-column>

                  <b-table-column :field="$data.selectedData == props.row.from_wallet ? 'from_wallet' : 'to_wallet'" label="From / To" sortable>
                      {{ showWallet(props.row.from_wallet, props.row.to_wallet) }}
                  </b-table-column>

                  <b-table-column field="amount" label="Amount" sortable>
                    <b-tag :type="formatStatus(props.row.from_wallet)" size="is-medium">
                      {{ props.row.amount }}
                    </b-tag>
                  </b-table-column>

                  <b-table-column field="status" label="Status" sortable>
                      {{ props.row.status | statusLabel }}
                  </b-table-column>
              </template>

              <template slot="empty">
                <div class="has-text-centered">
                  <b>The wallet doesn't cointain any transaction.</b>
                </div>
              </template>

              <template slot="footer">
                <div class="has-text-right">
                  Balance: {{ balance }}
                </div>
              </template>
            </b-table>
          </section>
        </article>
      </div>
    </div>

    <new-transaction :visible="openNewTransaction" 
                     :wallet="selectedWallet"
                     @close="closeNewTransaction">
    </new-transaction>
  </div>
</template>

<script>
  import moment from 'moment'
  import NewTransaction from './NewTransaction'
  import WalletList from '../wallets'
  
  const api = 'http://localhost:8000/balance'

  const STATUS_TRANSFERS = {
    'A': 'APPROVED',
    'C': 'CANCELED',
    'W': 'WAITING FOR APPROVE'
  }

  export default {
    components: {
      NewTransaction,
      WalletList
    },

    data () {
      return {
        selectedWallet: {
          id: 0,
          coin: {
            symbol: ''
          }
        },
        wallets: [],
        transactions: [],
        balance: 0,
        total: 0,
        loading: false,
        sortField: 'date_time',
        sortOrder: 'desc',
        defaultSortOrder: 'desc',
        page: 1,
        perPage: 5,
        openNewTransaction: false
      }
    },

    beforeCreate () {
      const loading = this.$loading.open({
        container: null
      })

      this.$http({
        url: `${api}/wallets/`
      }).then((response) => {
        response.data.data.forEach(wallet => this.wallets.push(wallet))
        this.$set(this.$data, 'selectedWallet', this.wallets[0])
        loading.close()
        this.loadAsyncData()
      }).catch((error) => {
        throw error
      })
    },

    methods: {
      loadAsyncData () {
        var params = [
          `sort_by=${this.sortField}.${this.sortOrder}`,
          `page=${this.page}`,
          `limit=${this.perPage}`
        ].join('&')

        this.transactions = []
        this.loading = true

        this.$http({
          url: `${api}/transfers/${this.selectedWallet.id}/?${params}`
        }).then((response) => {
          // this.total = response.data.pagination.total

          response.data.transactions.forEach((item) => {
            this.transactions.push(item)
          })

          this.balance = response.data.balance

          this.loading = false
        }).catch((error) => {
          this.transactions = []
          this.balance = 0
          this.total = 0
          this.loading = false
          throw error
        })
      },

      onPageChange (page) {
        this.page = page
        this.loadAsyncData()
      },

      onSort (field, order) {
        this.sortField = field
        this.sortOrder = order
        this.loadAsyncData()
      },

      selectWallet () {
        this.loadAsyncData()
      },

      showWallet (fromWallet, toWallet) {
        return fromWallet === this.selectedWallet.id ? toWallet : fromWallet
      },

      formatStatus (fromWallet) {
        return fromWallet === this.selectedWallet.id ? 'is-danger' : 'is-success'
      },

      newTransaction () {
        this.openNewTransaction = true
      },

      closeNewTransaction (transaction) {
        if (transaction !== null) {
          this.$http({
            method: 'POST',
            url: `${api}/transfers/${transaction.from_wallet}/`,
            data: transaction
          }).then((response) => {
            console.log(response)
          }).catch((error) => {
            throw error
          })
        }

        this.openNewTransaction = false
      }
    },
    filters: {
      formatDate (value) {
        return moment(value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD')
      },
      statusLabel (value) {
        return STATUS_TRANSFERS[value]
      }
    }
  }
</script>

<style scoped>

</style>
