<template>
  <card-modal title="New Transaction" transition="zoom"
              :visible="visible" 
              @close="close" 
              @cancel="close" 
              @ok="checkForm">
    <div class="content has-text-centered">      
      <b-field horizontal label="From Wallet">
        <b-input type="text" :value="wallet.id" required disabled></b-input>
      </b-field>

      <b-field horizontal label="To Wallet" :type="toWalletType" :message="toWalletMessage">
        <b-input type="text" 
                 v-model.trim="$v.to_wallet.$model"
                 ref="toWallet"></b-input>
      </b-field>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Amount</label>
        </div>
        <div class="field-body">
          <b-field :type="amountType" :message="amountMessage">        
            <b-input ref="amount" type="number"
                    v-model.trim.lazy="$v.amount.$model" 
                    expanded></b-input>            
          </b-field>
          <p class="control">
            <span class="button is-static">{{ wallet.coin.symbol }}</span>
          </p>
        </div>
      </div>
    </div>
  </card-modal>
</template>

<script>
import { CardModal } from 'vue-bulma-modal'
import { validationMixin } from 'vuelidate'
import { required, minLength, between, numeric } from 'vuelidate/lib/validators'

const touchMap = new WeakMap()

const api = 'http://localhost:8000/balance'

export default {
  components: {
    CardModal
  },

  mixins: [validationMixin],

  props: {
    visible: Boolean,
    wallet: Object
  },

  data () {
    return {
      to_wallet: null,
      amount: 0
    }
  },

  validations () {
    return {
      to_wallet: {
        required,
        minLength: minLength(6),
        isValid (value) {
          if (!value || value.length < 6) return false
          return new Promise((resolve, reject) => {
            this.$http({
              url: `${api}/wallet/${value}/`
            }).then((response) => {
              resolve(!response.data.hasOwnProperty('error'))
            }).catch((error) => {
              throw error
            })
          })
        }
      },
      amount: {
        required,
        numeric,
        between: between(1, this.maxAmount)
      }
    }
  },

  methods: {
    makeTransaction () {
      this.$emit('close', {
        from_wallet: this.wallet.id,
        to_wallet: this.to_wallet,
        amount: this.amount
      })
    },

    close () {
      this.$v.$reset()
      this.$v.to_wallet.$model = ''
      this.$v.amount.$model = 0
      this.$emit('close', null)
    },

    delayTouch ($v) {
      $v.$reset()

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }

      touchMap.set($v, setTimeout($v.$touch, 100))
    },

    formatInt ($v) {
      this.amount = parseInt($v.$model)
      console.log($v)
    },

    checkForm (e) {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.makeTransaction()
      }
    }
  },

  computed: {
    toWalletType () {
      if (this.$v.to_wallet.$error) {
        return 'is-danger'
      } else if (this.$v.to_wallet.$dirty && !this.$v.to_wallet.$error && this.$v.to_wallet.isValid) {
        return 'is-success'
      } else {
        return ''
      }
    },

    toWalletMessage () {
      if (this.$v.to_wallet.$error) {
        if (!this.$v.to_wallet.$model) {
          return 'This field is required.'
        } else if (!this.$v.to_wallet.minLength) {
          return 'This wallet provided must have at least 6 letters.'
        } else if (!this.$v.to_wallet.isValid) {
          return 'This wallet provided is invalid.'
        }
      } else if (this.$v.to_wallet.$dirty && !this.$v.to_wallet.$anyError && this.$v.to_wallet.isValid) {
        return 'This wallet provided is valid'
      } else {
        return ''
      }
    },

    amountType () {
      if (this.$v.amount.$error) {
        return 'is-danger'
      } else if (this.$v.amount.$dirty && !this.$v.amount.$error) {
        return 'is-success'
      } else {
        return ''
      }
    },

    amountMessage () {
      if (this.$v.amount.$error) {
        if (!this.$v.amount.$model) {
          return 'This field is required.'
        } else if (!this.$v.amount.between) {
          return `This amount provided must be between 1 and ${this.maxAmount}.`
        }
      } else {
        return ''
      }
    },

    maxAmount () {
      return this.wallet.balance
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
