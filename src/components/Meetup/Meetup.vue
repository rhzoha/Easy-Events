<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h6 class="primary--text">{{ meetup.title }}</h6>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>
            </template>
          </v-card-title>
          <v-card-media
            :src="meetup.imageUrl"
            height="400px"
          ></v-card-media>
          <v-card-text>
            <div class="info--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
            <div>
              <app-edit-meetup-date-dialog
                :meetup="meetup" v-if="userIsCreator">
              </app-edit-meetup-date-dialog>
              <app-edit-meetup-time-dialog
                :meetup="meetup" v-if="userIsCreator">
              </app-edit-meetup-time-dialog>
            </div>
            <div>{{ meetup.description }}</div>
            <div>{{ meetup.amount }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <app-meetup-register-dialog
              :meetupId="meetup.id"
              v-if="userIsAuthenticated && !userIsCreator"></app-meetup-register-dialog>
          </v-card-actions>
          <form method="POST">
            <vue-stripe-checkout
                ref="checkoutRef"
                :image="image"
                :name="name"
                :description="description"
                :currency="currency"
                :amount="meetup.amount*100"
                :allow-remember-me="false"
                @done="done"
                @opened="opened"
                @closed="closed"
                @canceled="canceled"
              ></vue-stripe-checkout>
              <v-btn @click="checkout">Checkout</v-btn> 
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';

  const API_URL = 'http://localhost:3000';

  export default {
    props: ['id'],
    data() {
      return {
        image: 'https://i.imgur.com/HhqxVCW.jpg',
        name: 'Sust Events',
        description: 'Purchase tickets from online now',
        currency: 'USD'
      }
    },
    computed: {
      meetup () {
        return this.$store.getters.loadedMeetup(this.id)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.$store.getters.user.id === this.meetup.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      async checkout () {
        // token - is the token object
        // args - is an object containing the billing and shipping address if enabled
        const { token, args } = await this.$refs.checkoutRef.open();

      },
      done ({token, args}) {
        // token - is the token object
        // args - is an object containing the billing and shipping address if enabled
        // do stuff...
      
        // handle the token
        axios.post(`${window.endpoint}/charge`, {
            stripeToken: token.id,
            amount: this.$store.getters.loadedMeetup(this.id).amount
          })
      },
      opened () {
        // do stuff 
        
      },
      closed () {
        // do stuff 
      },
      canceled () {
        // do stuff 
      },
      getStripeData() {
        apiService.getStripeData()
          .then(data => {
            return this.name = data.name
          })
      }
    },
    updated() {
      
    }
  }
</script>
