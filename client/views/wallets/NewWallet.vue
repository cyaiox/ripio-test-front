<template>
  <card-modal title="New Wallet" transition="zoom"
              :visible="visible" 
              @close="close" 
              @cancel="close" 
              @ok="checkForm">
    <div class="content has-text-centered">      
      <b-field horizontal label="Coin" :type="coinType" :message="coinMessage" >
        <b-select placeholder="Select a coin" v-model.trim="$v.coin.$model" expanded>
          <option v-for="coin in coins" 
                  :value="coin.id"
                  :key="coin.id">
            {{ coin.symbol }} - {{ coin.name.toUpperCase() }}
          </option>
        </b-select>
      </b-field>
      <a class="has-text-grey new-coin" @click="newCoin">Suggest a new coin</a>
    </div>
    <new-coin :visible="openNewCoin" @close="closeNewCoin"></new-coin>
  </card-modal>  
</template>

<script>
import Vue from 'vue'
import Notification from 'vue-bulma-notification'
import { CardModal } from 'vue-bulma-modal'
import NewCoin from '../coin/NewCoin'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

const NotificationComponent = Vue.extend(Notification)

const touchMap = new WeakMap()

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
    CardModal,
    NewCoin
  },

  mixins: [validationMixin],

  props: {
    visible: Boolean,
    coins: Array
  },

  data () {
    return {
      coin: null,
      openNewCoin: false
    }
  },

  validations () {
    return {
      coin: {
        required
      }
    }
  },

  methods: {
    createWallet () {
      this.$emit('close', {
        coin: this.coin
      })
    },

    close () {
      this.$v.coin.$model = null
      this.$v.$reset()
      this.$emit('close', null)
    },

    delayTouch ($v) {
      $v.$reset()

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }

      touchMap.set($v, setTimeout($v.$touch, 100))
    },

    checkForm (e) {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.createWallet()
      }
    },

    newCoin () {
      this.openNewCoin = true
    },

    closeNewCoin (coin) {
      if (coin !== null) {
        this.$http({
          method: 'POST',
          url: `${api}/coins/`,
          data: coin
        }).then((response) => {
          if (!response.data.hasOwnProperty('error')) {
            openNotification({
              message: 'The coin was suggested successfully.',
              type: 'success',
              duration: 3000
            })
          } else {
            openNotification({
              message: 'The coin cannot be suggested.',
              type: 'danger',
              duration: 3000
            })
          }
        }).catch((error) => {
          openNotification({
            message: 'The coin cannot be suggested.',
            type: 'danger',
            duration: 3000
          })
          throw error
        })
      }

      this.openNewCoin = false
    }
  },

  computed: {
    coinType () {
      if (this.$v.coin.$error) {
        return 'is-danger'
      } else if (this.$v.coin.$dirty && !this.$v.coin.$error) {
        return 'is-success'
      } else {
        return ''
      }
    },

    coinMessage () {
      if (this.$v.coin.$error) {
        if (!this.$v.coin.$model) {
          return 'This field is required.'
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .new-coin {
    border-bottom: 1px solid currentColor;
  }

  .notifications {
    z-index: 999999;
    position: absolute;
  }
</style>
