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
        <v-card class="rounded-card">
          <v-img
            :src="meetup.imageUrl"
            height="400px"
          ></v-img>
          <v-card-title>
            <h1 class="primary--text">{{ meetup.title }}</h1>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>
            </template>
          </v-card-title>
          
          <v-card-text>
            <div class="secondary--text">{{ meetup.date | date }}</div>
            <div class="text--darken-1 mb-2">Location: {{ meetup.location }}</div>

            <div>
              <app-edit-meetup-date-dialog
                :meetup="meetup" v-if="userIsCreator">
              </app-edit-meetup-date-dialog>
              <app-edit-meetup-time-dialog
                :meetup="meetup" v-if="userIsCreator">
              </app-edit-meetup-time-dialog>
            </div>

            <div><p>{{ meetup.description }}</p></div>

          </v-card-text>

          <GmapMap
            :center="{lat:24.92098105, lng:91.83377772}"
            :zoom="16"
            map-type-id="terrain"
            style="width: 100%; height: 30vh; z-index: 0"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false,
              disableDefaultUi: false
            }"
          >
            <GmapMarker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :clickable="true"
              :draggable="true"
              @click="center=m.position"
            />
          </GmapMap>

          <v-card-actions>
            <app-meetup-register-dialog
              :meetupId="meetup.id"
              v-if="userIsAuthenticated && !userIsCreator" style="width:100%"></app-meetup-register-dialog>
          </v-card-actions>

          <form method="POST">
            <vue-stripe-checkout
                ref="checkoutRef"
                :image="image"
                :name="name"
                :description="description"
                :currency="currency"
                :amount="meetup.ticketPrice*100"
                :allow-remember-me="false"
                @done="done"
                @opened="opened"
                @closed="closed"
                @canceled="canceled"
              ></vue-stripe-checkout>

              <v-card-actions >
                <v-btn 
                @click="checkout" 
                v-if="userIsAuthenticated && !userIsCreator" style="width:100%" class="primary">Checkout</v-btn> 
              </v-card-actions>
              
          
          </form>

          <v-btn color="error" @click="downloadPdf" v-if="checkTokenStatus">Download Ticket as PDF</v-btn>

        </v-card>
      </v-flex>
    </v-layout>
    <v-layout 
      row 
      wrap 
      v-if="checkTokenStatus" 
      ref="content"
      class="toPdf"
      >
      <v-flex xs6 md6 >
        <h4>Event Name</h4>
        <h4> {{ meetup.title }} </h4>
        <h4>Location</h4>
        <h4> {{ meetup.location }} </h4>
        <h4>User name</h4>
        <h4> {{ authUser.displayName }} </h4>
        <h4>Email</h4>
        <h4> {{ authUser.email }} </h4>
        <h4>Bkash Number</h4>
        <h4> {{ authUser.phoneNumber }} </h4>
        <h4>Ticket Price Paid</h4>
        <h4> {{ meetup.ticketPrice }} </h4>
        <h4>Time of Transactions</h4>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import firebase from "firebase"
  import axios from 'axios';
  import jsPDF from 'jspdf';

  const API_URL = 'https://sustevents.mybluemix.net';

  export default {
    props: ['id'],
    data() {
      return {
        authUser: null,
        userName: '',
        image: 'https://i.imgur.com/HhqxVCW.jpg',
        name: 'Sust Events',
        description: 'Purchase tickets from online now',
        currency: 'BDT',
        tokenId: null
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
      },
      checkTokenStatus () {
        if (this.tokenId != null) {
          return true
        } else return false
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
            ticketPrice: this.$store.getters.loadedMeetup(this.id).ticketPrice
          })
        this.tokenId = token.id
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
      downloadPdf() {
        const doc = new jsPDF();
        const contentHtml = this.$refs.content.innerHTML;
        doc.fromHTML(contentHtml, 15, 15, {
          width: 170
        });
        doc.save(`ticket_${this.tokenId}.pdf`);
      },
      getUsername() {
        return 
      }
    },
    mounted () {
      firebase.auth().onAuthStateChanged((user) => {
        this.authUser = user
      })
    }
   
  }
</script>

<style>
  .toPdf{
    height: 0;
    opacity: 0;
  }
</style>