import * as firebase from 'firebase'
import { db } from '../../main'

export default {
  state: {
    loadedMeetups: [
      // {
      //   imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',
      //   id: 'afajfjadfaadfa323',
      //   title: 'Meetup in New York',
      //   date: new Date(),
      //   location: 'New York',
      //   description: 'New York, New York!'
      // },
      // {
      //   imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg',
      //   id: 'aadsfhbkhlk1241',
      //   title: 'Meetup in Paris',
      //   date: new Date(),
      //   location: 'Paris',
      //   description: 'It\'s Paris!'
      // }
    ]
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      // firebase.database().ref('meetups').once('value')
      firebase.firestore().collection('meetups').get()
        .then((querySnapshot) => {
          const meetups = []
          // const obj = data.val()
          // const obj = querySnapshot.data()
          querySnapshot.docs.forEach((doc) => {
            meetups.push({
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              imageUrl: doc.data().imageUrl,
              date: doc.data().date,
              location: doc.data().location,
              creatorId: doc.data().creatorId,
              ticketPrice: doc.data().ticketPrice
            })
          })
          // for (let key in obj) {
          //   meetups.push({
          //     id: key,
          //     title: obj[key].title,
          //     description: obj[key].description,
          //     imageUrl: obj[key].imageUrl,
          //     date: obj[key].date,
          //     location: obj[key].location,
          //     creatorId: obj[key].creatorId
          //   })
          // }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
          }
        )
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        id: '',
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        ticketPrice: payload.ticketPrice,
        creatorId: getters.user.id,
        imageUrl: ''
      }
      let imageUrl
      let key
      let filename
      let ext
      // firebase.database().ref('meetups').push(meetup)
      db.collection('meetups').add(meetup)
        .then((data) => {
          key = data.id
          return key
        })
        .then(key => {
          filename = payload.image.name
          ext = filename.slice(filename.lastIndexOf('.'))
      
          return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
        })
        .then(() => {
          return firebase.storage().ref('meetups/' + key + '.' + ext).getDownloadURL().then((url) => {
            imageUrl = url
          })
          // return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
          // return db.collection('meetups').doc(key).update({key: key, imageUrl: this.state.url})
        })
        .then(() => {
          // return db.collection('meetups').doc(key).update({imageUrl: this.state.url})
          return db.collection('meetups').doc(key).update({id: key, imageUrl: imageUrl})
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
      // Reach out to firebase and store it
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      db.collection('meetups').doc(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    }
  }
}
