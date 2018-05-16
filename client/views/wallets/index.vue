<template>
  <div>
    Hola enfermera! :D
  </div>
</template>

<script>
  const api = 'http://localhost:8000/balance/wallets/'

  export default {
    data () {
      return {
        wallets: []
      }
    },

    beforeCreate () {
      this.$http({
        url: api
      }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
</script>

<style scoped>

</style>
