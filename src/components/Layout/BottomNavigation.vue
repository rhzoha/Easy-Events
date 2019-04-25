<template>
  <div xs10 offset-xs1>
    <v-bottom-nav
        :active.sync="activeBtn"
        :value="showNav"
        fixed
        shift
        color="default"
        style="border-top-left-radius: 10px;
              border-top-right-radius: 10px;"
    >
        <v-btn flat color="primary" to="/" >
            <span>Home</span>
            <v-icon>place</v-icon>
        </v-btn>

        <v-btn flat color="primary" to="/meetups" >
            <span>Nearby</span>
            <v-icon>date_range</v-icon>
        </v-btn>

        <v-btn flat color="primary" to="/profile">
            <span>Profile</span>
            <v-icon>face</v-icon>
        </v-btn>
    </v-bottom-nav>
  </div>
  
      
</template>

<script>
export default {
  data () {
    return {
      activeBtn: 0,
      showNav: true
    }
  }
}
</script>

<style>

</style>