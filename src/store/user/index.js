import * as firebase from 'firebase'
import { db } from '../../main'

export default {
  state: {
    user: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      // firebase.database().ref('/users/' + user.id).child('/registrations/')
      firebase.firestore().collection('users').doc()
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, fbKey: data.key})
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      let docRefKey
      let displayName
      let photoURL
      let uid
      let bkash
      firebase.auth().createUserWithEmailAndPassword(payload.reg.email, payload.reg.password)
        .then(
          user => {
            commit('setLoading', true)
            uid = user.user.uid
            displayName = payload.reg.displayName
            bkash = payload.reg.bkash
            photoURL = "https://example.com/jane-q-user/profile.jpg"
            
            let currentuser = firebase.auth().currentUser
            currentuser.updateProfile({
              displayName: displayName,
              photoURL: photoURL,
              phoneNumber: bkash
            })
            .then(() => {
              //add user to firebase
              firebase.firestore().collection('users').add({
                id: uid,
                displayName: displayName,
                address: payload.reg.address,
                city: payload.reg.city,
                bkash: payload.reg.bkash,
                visa: payload.reg.visa,
                photoURL: photoURL,
                docRefId: null,
                registeredMeetups: [],
                fbKeys: {}
              })
              .then((data) =>{
                docRefKey = data.id
                
              })
              .then(() => {
                // return db.collection('meetups').doc(key).update({imageUrl: this.state.url})
                db.collection('users').doc(docRefKey).update({docRefId: docRefKey})

                //set new user for store
                commit('setLoading', true)
                const newUser = {
                  id: uid,
                  displayName: displayName,
                  address: payload.reg.address,
                  city: payload.reg.city,
                  bkash: payload.reg.bkash,
                  visa: payload.reg.visa,
                  photoURL: photoURL,
                  docRefId: docRefKey,
                  registeredMeetups: [],
                  fbKeys: {}
                }
                commit('setUser', newUser)
              })
            })
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
              }
            )
            
            //set new user for store
            commit('setLoading', false)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            let currentUser = firebase.auth().currentUser 
            const newUser = {
              id: user.user.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = {}
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            displayName: getters.user.displayName,
            address: getters.user.address,
            city: getters.user.city,
            bkash: getters.user.bkash,
            visa: getters.user.visa,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
