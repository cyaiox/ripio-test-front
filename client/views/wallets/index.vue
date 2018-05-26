<template>
  <article class="tile is-child box is-vertical is-3">    
      <h4 class="title">Wallets</h4>
      <summary-box v-for="wallet in wallets" 
                  :wallet="wallet" 
                  :key="wallet.id"
                  :class="{'notification is-primary': wallet.id == value.id}"
                  @click="click">
      </summary-box>    
  </article>
</template>

<script>
  import SummaryBox from './SummaryBox'

  export default {
    props: {
      wallets: Array,
      value: Object
    },

    components: {
      SummaryBox
    },

    methods: {
      click (wallet) {
        this.$emit('input', wallet)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
