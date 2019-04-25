<template>
  <v-layout row wrap>
    <v-container grid-list-xs>
      <v-flex
          xs12
          md6
          align-center
          justify-center
          text-xs-center
        >
        <v-card elevation-5 class="rounded-card">
          
          <v-avatar
            :tile="tile"
            :size="150"
            color="grey lighten-4"
          >
            <v-icon >account_circle</v-icon>
          </v-avatar>
        
          <v-card-text class="text-xs-center">
            <h6 class="category text-gray font-weight-thin mb-3">{{ authUser.email }}</h6>
            
            <h4 class="card-title font-weight-bold">#{{ authUser.displayName }}</h4>
            
            <v-layout column wrap>
              <v-flex align-start justify-center column fill-heigh>
                <h4 class="card-description font-weight-light">Email Address</h4>
                <h4 class="pb-3"> {{ authUser.email }} </h4>
                <h4 class="card-description font-weight-light">Location</h4>
                <h4 class="pb-3"> Sylhet </h4>
                <h4 class="card-description font-weight-light">Bkash Number</h4>
                <h4 class="pb-3"> {{ authUser.phoneNumber }} </h4>
              </v-flex>
            </v-layout>
            
            <v-btn
              color="success"
              round
              class="font-weight-light"
              @click.stop="dialog = true"
            >Edit Profile</v-btn>

            <v-dialog
              v-model="dialog"
              max-width="290"
            >
              <v-card>
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-card-title class="font-weight-bold">Edit Profile</v-card-title>
                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-card-text>
                        <v-text-field
                          name="username"
                          label="Change Username"
                          id="username"
                          v-model="editedUsername"
                          ></v-text-field>
                        <v-text-field
                          name="location"
                          label="Change Current Location"
                          id="location"
                          v-model="editedLocaiotn"
                          ></v-text-field>
                          <v-text-field
                          name="bkash"
                          label="Change Current Bkash Number"
                          id="bkash"
                          v-model="editedBkashNumber"
                          ></v-text-field>
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-card-actions>
                        <v-btn
                          flat
                          class="blue--text darken-1"
                          @click="dialog = false">Close</v-btn>
                        <v-btn flat class="blue--text darken-1">Save</v-btn>
                      </v-card-actions>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import firebase from "firebase"

export default {
  data () {
    return {
      authUser: null,
      dialog: false
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
  mounted () {
    firebase.auth().onAuthStateChanged((user) => {
      this.authUser = user
    })
  }
}
</script>

<style>

</style>

