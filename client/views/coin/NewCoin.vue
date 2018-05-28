<template>
  <card-modal title="New Coin" transition="zoom"
              :visible="visible" 
              @close="close" 
              @cancel="close" 
              @ok="checkForm">
    <div class="content has-text-centered">      
      <b-field horizontal label="Name" :type="nameType" :message="nameMessage">
        <b-input type="text" maxlength="64" v-model.trim="$v.name.$model"></b-input>
      </b-field>

      <b-field horizontal label="Description" :type="descriptionType" :message="descriptionMessage">
        <b-input type="textarea" maxlength="128" v-model.trim="$v.description.$model"></b-input>
      </b-field>

      <b-field horizontal label="Symbol" :type="symbolType" :message="symbolMessage">
        <b-input type="text" maxlength="5" v-model.trim="$v.symbol.$model"></b-input>
      </b-field>
    </div>
  </card-modal>
</template>

<script>
import { CardModal } from 'vue-bulma-modal'
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    CardModal
  },

  mixins: [validationMixin],

  props: {
    visible: Boolean
  },

  data () {
    return {
      name: '',
      description: '',
      symbol: ''
    }
  },

  validations () {
    return {
      name: {
        required,
        maxLength: maxLength(64)
      },
      description: {
        required,
        maxLength: maxLength(128)
      },
      symbol: {
        required,
        maxLength: maxLength(5)
      }
    }
  },

  methods: {
    createCoin () {
      this.$emit('close', {
        name: this.name,
        description: this.description,
        symbol: this.symbol
      })
    },

    close () {
      this.$v.name.$model = ''
      this.$v.description.$model = ''
      this.$v.symbol.$model = ''
      this.$v.$reset()
      this.$emit('close', null)
    },

    checkForm (e) {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.createCoin()
      }
    }
  },

  computed: {
    nameType () {
      if (this.$v.name.$error) {
        return 'is-danger'
      } else if (this.$v.name.$dirty && !this.$v.name.$error) {
        return 'is-success'
      } else {
        return ''
      }
    },

    nameMessage () {
      if (this.$v.name.$error) {
        if (!this.$v.name.$model) {
          return 'This field is required.'
        }
      } else {
        return ''
      }
    },

    descriptionType () {
      if (this.$v.description.$error) {
        return 'is-danger'
      } else if (this.$v.description.$dirty && !this.$v.description.$error) {
        return 'is-success'
      } else {
        return ''
      }
    },

    descriptionMessage () {
      if (this.$v.description.$error) {
        if (!this.$v.description.$model) {
          return 'This field is required.'
        }
      } else {
        return ''
      }
    },

    symbolType () {
      if (this.$v.symbol.$error) {
        return 'is-danger'
      } else if (this.$v.symbol.$dirty && !this.$v.symbol.$error) {
        return 'is-success'
      } else {
        return ''
      }
    },

    symbolMessage () {
      if (this.$v.symbol.$error) {
        if (!this.$v.symbol.$model) {
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
</style>
