<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">Balance</h4>
          Wallet: 
          <select v-model="selected_wallet">
            <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id" v-text="wallet.id"></option>
          </select>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>To Wallet</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>Date</th>
                <th>To Wallet</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td><span v-text="transaction.date"></span></td>
                <td><span v-text="transaction.to_wallet"></span></td>
                <td><span v-text="transaction.amount"></span></td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
  const api = 'http://localhost:8000/balance/'

  export default {
    data () {
      return {
        selected_wallet: '',
        wallets: [],
        transactions: [{
          date: '2018/05/18',
          from_wallet: 'XdFs',
          to_wallet: 'PlOplO',
          amount: '500',
          coin: 'USD'
        }]
      }
    },

    beforeCreate () {
      this.$http({
        url: api + 'wallets/'
      }).then((response) => {
        console.log(response)
        response.data.data.forEach(wallet => this.wallets.push(wallet))
        this.$set(this.$data, 'selected_wallet', this.wallets[0].id)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
</script>

<style scoped>

</style>
