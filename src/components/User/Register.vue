<template>
  <v-layout align-center justify-center row>
    <v-flex xs12 md8 sm12>
       <v-tabs centered color="primary" dark icons-and-text grow slider-color="secondary">
          <v-tab href="#register" style="background-color: rgba(0,0,0,0.5);">
            Register
            <v-icon>account_box</v-icon>
          </v-tab>
          
          <v-tab-item value="register" class="mt-2">
            <v-card class="rounded-card">
              <v-stepper v-model="step" vertical>
                <v-stepper-header>
                  <v-stepper-step step="1" :complete="step > 1">Your Information</v-stepper-step>
                    <v-divider></v-divider>
                  <v-stepper-step step="2" :complete="step > 2">Your Address</v-stepper-step>
                    <v-divider></v-divider>
                  <v-stepper-step step="3">Billing Info</v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1" style="border-left: 0">
                    <v-text-field
                      v-model="reg.firstname"
                      :counter="10"
                      label="First name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="reg.lastname"
                      :counter="10"
                      label="Last name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="reg.email"
                      v-validate="'required|email'"
                      :error-messages="errors.collect('reg.email')"
                      label="E-mail"
                      data-vv-name="reg.email"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="reg.password"
                      v-validate="'required|min:6'"
                      :error-messages="errors.collect('reg.password')"
                      label="Password"
                      type="password"
                      data-vv-name="reg.password"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="reg.confirmpassword"
                      v-validate="'required'"
                      :error-messages="errors.collect('reg.confirmpassword')"
                      label="Confrim Password"
                      type="password"
                      data-vv-name="reg.confirmpassword"
                      :rules="[comparePasswords]"
                      required
                    ></v-text-field>

                    <v-btn color="primary" @click.native="step = 2" :disabled="formErrorStep1">Continue</v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="2" style="border-left: 0">
                    <v-text-field
                      v-model="reg.address"
                      label="Adddress"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="reg.city"
                      label="Where do you live"
                      required
                    ></v-text-field>

                    <v-btn flat @click.native="step = 1">Previous</v-btn>
                    <v-btn color="primary" @click.native="step = 3" :disabled="formErrorStep2">Continue</v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="3" style="border-left: 0">
                    <v-text-field
                      v-model="reg.bkash"
                      label="Bkash Account Number"
                    ></v-text-field>
                    <v-text-field
                      v-model="reg.visa"
                      label="Bank account visa"
                    ></v-text-field>
                    <v-checkbox
                      v-model="reg.checkbox"
                      v-validate="'required'"
                      :error-messages="errors.collect('reg.checkbox')"
                      value="1"
                      label="I agree, proceed!"
                      data-vv-name="reg.checkbox"
                      type="checkbox"
                      required
                    ></v-checkbox>

                    <v-btn flat @click.native="step = 2">Previous</v-btn>
                    <v-btn color="primary" @click.prevent="onSignup" :disabled="formErrorStep3" :loading="loading">
                      Sign up
                       <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
                    </v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-card>
            
          </v-tab-item>

        </v-tabs>
    </v-flex>
  </v-layout>
  
  
</template>

<script>
export default {
  data: () => ({
    step: 1,
    reg: {
      firstname:null,
      lastname: null,
      email: null,
      password: null,
      address: null,
      city: null,
      bkash: null,
      visa: null,
      checkbox: null
    }
  }),

  methods: {  
    onSignup () {
      this.$store.dispatch('signUserUp', {reg: this.reg})
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
    
  },

  computed: {
    comparePasswords () {
      return this.reg.password !== this.reg.confirmpassword ? 'Passwords do not match' : ''
    },
    formErrorStep1() {
      if(this.reg.firstname && this.reg.lastname != null && !this.errors.any()){
        return false
      } else return true
    },
    formErrorStep2() {
      if(this.reg.address && this.reg.city != null && !this.errors.any()){
        return false
      } else return true
    },
    formErrorStep3() {
      if(this.reg.checkbox != null) {
        return false
      } else return true
    },
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
  }
}
</script>

<style>

</style>