<template>
  <div class="content has-text-centered">
    <h1 class="is-title is-bold">Sign Up</h1>

    <div class="columns is-vcentered">
      <div class="column is-6 is-offset-3">
        <div class="box">
          <b-field label="Email" :type="usernameType" :message="usernameMessage">
            <b-input type="email" v-model.trim="$v.username.$model" placeholder="example@myemail.com"></b-input>
          </b-field>

          <b-field label="Password" :type="passwordType" :message="passwordMessage">
            <b-input type="password" v-model.trim="$v.password.$model" password-reveal></b-input>
          </b-field>

          <b-field label="Repeat Password" :type="repeatPasswordType" :message="repeatPasswordMessage">
            <b-input type="password" v-model.trim="$v.repeatPassword.$model"></b-input>
          </b-field>

          <hr>
          
          <p class="control">
            <button class="button is-primary" @click="signUp">Sign Up</button>
            <button class="button is-default">Cancel</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'

  const api = 'http://localhost:8000/signup/'

  export default {
    mixins: [validationMixin],

    data () {
      return {
        username: '',
        password: '',
        repeatPassword: ''
      }
    },

    validations () {
      return {
        username: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(8)
        },
        repeatPassword: {
          required,
          minLength: minLength(8),
          sameAsPassword: sameAs('password')
        }
      }
    },

    methods: {
      signUp () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.$auth.register({
            url: api,
            data: {
              username: this.username,
              password: this.password
            },
            autoLogin: true,
            redirect: {name: 'wallet'}
          })
        }
      }
    },

    computed: {
      usernameType () {
        if (this.$v.username.$error) {
          return 'is-danger'
        } else if (this.$v.username.$dirty && !this.$v.username.$error) {
          return 'is-success'
        } else {
          return ''
        }
      },

      usernameMessage () {
        if (this.$v.username.$error) {
          if (!this.$v.username.$model) {
            return 'This field is required.'
          }
        } else {
          return ''
        }
      },

      passwordType () {
        if (this.$v.password.$error) {
          return 'is-danger'
        } else if (this.$v.password.$dirty && !this.$v.password.$error) {
          return 'is-success'
        } else {
          return ''
        }
      },

      passwordMessage () {
        if (this.$v.password.$error) {
          if (!this.$v.password.$model) {
            return 'This field is required.'
          }
        } else {
          return ''
        }
      },

      repeatPasswordType () {
        if (this.$v.repeatPassword.$error) {
          return 'is-danger'
        } else if (this.$v.repeatPassword.$dirty && !this.$v.repeatPassword.$error && this.$v.repeatPassword.sameAsPassword) {
          return 'is-success'
        } else {
          return ''
        }
      },

      repeatPasswordMessage () {
        if (this.$v.repeatPassword.$error) {
          if (!this.$v.repeatPassword.$model) {
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
