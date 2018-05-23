<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <h4 class="title">Balance</h4>
            </div>
            <div class="column is-one-quarter">
              Wallet: 
              <select v-model="selected_wallet">
                <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id" v-text="wallet.id"></option>
              </select>
            </div>
          </div>
          <section>
            <b-table
              :data="transactions"
              :loading="loading"
              paginated
              backend-pagination
              :total="total"
              :per-page="perPage"
              @page-change="onPageChange"

              backend-sorting
              :default-sort-direction="defaultSortOrder"
              :default-sort="[sortField, sortOrder]"
              @sort="onSort">

              <template slot-scope="props">
                  <b-table-column field="date_time" label="Date" sortable>
                      {{ props.row.title }}
                  </b-table-column>

                  <b-table-column field="to_wallet" label="To Wallet" sortable>
                      {{ props.row.author }}
                  </b-table-column>

                  <b-table-column field="amount" label="Amount" sortable>
                      {{ props.row.libraries }}
                  </b-table-column>
              </template>
            </b-table>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
  const api = 'http://localhost:8000/balance'

  export default {
    data () {
      return {
        selected_wallet: '',
        wallets: [],
        transactions: [],
        total: 0,
        loading: false,
        sortField: 'date_time',
        sortOrder: 'desc',
        defaultSortOrder: 'desc',
        page: 1,
        perPage: 5
      }
    },

    beforeCreate () {
      this.$http({
        url: `${api}/wallets/`
      }).then((response) => {
        response.data.data.forEach(wallet => this.wallets.push(wallet))
        this.$set(this.$data, 'selected_wallet', this.wallets[0].id)
        this.loadAsyncData()
      }).catch((error) => {
        console.log(error)
      })
    },

    methods: {
      loadAsyncData () {
        var params = [
          `sort_by=${this.sortField}.${this.sortOrder}`,
          `page=${this.page}`,
          `limit=${this.perPage}`
        ].join('&')

        this.loading = true

        this.$http({
          url: `${api}/transfers/${this.selected_wallet}/?${params}`
        }).then((response) => {
          this.transactions = []

          this.total = response.data.pagination.total

          response.data.results.forEach((item) => {
            this.transactions.push(item)
          })

          this.loading = false
        }).catch((error) => {
          this.transactions = []
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
      }
    }
  }
</script>

<style scoped>

</style>
