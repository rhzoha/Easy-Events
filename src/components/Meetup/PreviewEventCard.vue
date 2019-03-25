<template>
  <v-card elevation-5 class="rounded-card">
    <v-img
      class="white--text"
      height="200px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
    </v-img>

    <v-card-title primary-title>
      <div>
        <span class="red--text">Start date - End date</span>
        <div class="headline">Event Title</div>
        <span class="grey--text">Location</span>
      </div>
    </v-card-title>

    <v-card-actions class="px-3">
      <v-icon>star_border</v-icon>
      <span class="grey--text px-1">Networking 10 people</span>
      <v-spacer></v-spacer>
      <v-btn flat color="orange">Explore</v-btn>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-slide-y-transition>
      <v-card-text class="px-3" v-show="show">
        Description
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    show: false
  })
}
</script>

<style>
  .rounded-card{
    border-radius: 10px
  }
</style>
