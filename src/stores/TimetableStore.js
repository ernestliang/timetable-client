import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const AUTH_KEY = "community-client"

export const useTimetableStore = defineStore('TimetableStore', {
    state: () => ({
        timetable: [],
    }),
    getters: {
        getTimetable: (state) => {
            return state.timetable
        },
        getTimetableByDay: (state) => {
            var timetableDays = [
                {id: 1, name: 'Monday', events: []},
                {id: 2, name: 'Tuesday', events: []},
                {id: 3, name: 'Wednesday', events: []},
                {id: 4, name: 'Thursday', events: []},
                {id: 5, name: 'Friday', events: []},
            ]

            // for (var i=0; i<state.timetable.length; i++) {
            //     let x = timetableDays.find(x => x.id == state.timetable[i].classDay)
            //     if (x != null) {
            //         x.events.push(state.timetable[i])
            //     }
            // }


            state.timetable.map(x => {
                let evt = timetableDays.find(t => t.id == x.classDay)
                if (evt != null) {
                    evt.events.push(x)
                }
            })

            // state.timetable.map(t => {

            // })

            return timetableDays
        }
    },
    actions: {
        async retrieveByCourse(courseId) {
            await axios.get(`${API_URL}/timetable/course/${courseId}`)
            .then(res => {
                this.timetable = res.data
            })
            .catch(err => {
                throw err
            })
        }
    }
});