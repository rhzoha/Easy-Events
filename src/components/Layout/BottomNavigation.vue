<template>
  <div xs10 offset-xs1>
    <v-bottom-nav
        :active.sync="activeBtn"
        :value="showNav"
        fixed
        shift
        color="default"
    >
        <v-btn flat color="primary" to="/" >
            <span>Recents</span>
            <v-icon>history</v-icon>
        </v-btn>

        <v-btn flat color="primary">
            <span>Favorites</span>
            <v-icon>favorite</v-icon>
        </v-btn>

        <v-btn flat color="primary" to="/meetups" >
            <span>Nearby</span>
            <v-icon>place</v-icon>
        </v-btn>
    </v-bottom-nav>
  </div>
  
      
</template>

<script>
export default {
  data () {
    return {
      activeBtn: 1,
      showNav: true
    }
  }
}
</script>

<style>

</style>