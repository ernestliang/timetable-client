import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const AUTH_KEY = "community-client"

export const useCourseStore = defineStore('CourseStore', {
    state: () => ({
        courses: [],
    }),
    getters: {
        getCourses: (state) => {
            return state.courses
        },
        getTimetableByDay: (state) => {

        }
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/courses`)
            .then(res => {
                this.courses = res.data
            })
            .catch(err => {
                throw err
            })
        }
    }
});