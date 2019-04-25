<template>
  <v-container style="padding: 0px">
    <GmapMap
      :center="{lat:24.92098105, lng:91.83377772}"
      :zoom="12"
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
    <div style="
      position: absolute;
      top: 27vh;
      box-shadow: 0 -5px 5px -5px rgba(0,0,0,.5);
      width: 100%;
      background-color: #ffffff;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 5px;">
      <h2 class="text-xs-center">Upcoming Events</h2>
    </div>
    <v-container grid-list-xs>
      <!-- <v-layout row wrap>
        <v-flex xs12 sm6 class="text-xs-center text-sm-right">
          <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
        </v-flex>
        <v-flex xs12 sm6 class="text-xs-center text-sm-left">
          <v-btn large router to="/meetup/new" class="info">Organize Meetup</v-btn>
        </v-flex>
      </v-layout> -->
      <v-layout>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular
            indeterminate
            class="primary--text"
            :width="7"
            :size="70"
            v-if="loading"></v-progress-circular>
        </v-flex>
      </v-layout>
      
      <v-card 
        elevation-5 
        class="rounded-card mb-2"
        v-for="meetup in meetups"
        :key="meetup.id"
        >
        <v-img
          class="white--text"
          height="200px"
          :src="meetup.imageUrl"
        >
        </v-img>

        <v-card-title primary-title>
          <div>
            <span class="red--text">{{meetup.date | date}}</span>
            <div class="headline">{{meetup.title}}</div>
            <span class="grey--text">{{meetup.location}}</span>
          </div>
        </v-card-title>

        <v-card-actions class="px-3">
          <v-icon>star_border</v-icon>
          <span class="grey--text px-1">Joined 1 people</span>
          <v-spacer></v-spacer>

          
          <v-btn flat color="orange" :to="'/meetups/' + meetup.id">Explore</v-btn>


          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-slide-y-transition>
          <v-card-text class="px-3" v-show="show">
            {{meetup.description}}
          </v-card-text>
        </v-slide-y-transition>
      </v-card>

    </v-container>
     
  </v-container>
</template>

<script>

  export default {
    data() {
      return{
        show: false
      }
    },
    computed: {
      meetups () {
        return this.$store.getters.featuredMeetups
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup (id) {
        this.$router.push('/meetups/' + id)
      }
    }
  }
</script>

<style scoped>
  .title {
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 2em;
    padding: 20px;
  }
</style>
