<template>
  <a class="tile is-child box" @click="click">
    <p><strong>{{ wallet.id }}</strong></p>
    <p>Coin: {{ wallet.coin.symbol }}</p>
    <p>Balance: {{ wallet.balance }}</p>
  </a>
</template>

<script>
  export default {
    props: {
      wallet: Object
    },

    methods: {
      click () {
        this.$emit('click', this.wallet)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    margin-bottom: 5px !important;
    max-height: 1rem;
  }
</style>
