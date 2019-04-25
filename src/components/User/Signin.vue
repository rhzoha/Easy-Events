<template>
  <v-layout row wrap>
    <div class="backgroundImg" style="
      width: 100%;
      height: 35vh;
      background-color: #ededed;
      background-image: linear-gradient(to bottom right, green, yellow);
      border-bottom-right-radius: 150px;    
      ">
      <v-layout row wrap align-center justify-center column fill-height style="font-family: 'Amatic SC', cursive;">
        <h1 style="font-size: 48px">SUST EVENTS</h1>
        <h4 style="font-size: 18px">A Fast & Secured E-Ticketing Platform</h4>
      </v-layout>
      
    </div>
  
    <v-container>
      <v-layout v-if="error">
        <v-flex xs12 sm6 offset-sm3>
          <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
        </v-flex>
      </v-layout>
      <v-layout row fill-height>
        <v-flex xs10 sm6 offset-sm3 offset-xs1>
          <v-card class="rounded-card">
            <v-card-text>
              <v-container>
                <form @submit.prevent="onSignin">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="email"
                        label="Mail"
                        id="email"
                        v-model="email"
                        type="email"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="password"
                        label="Password"
                        id="password"
                        v-model="password"
                        type="password"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn type="submit" :disabled="loading" :loading="loading">
                        Sign in
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        password: ''
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      onSignin () {
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
  }
</script>
