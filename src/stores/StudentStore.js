import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const AUTH_KEY = "community-client"

export const useStudentStore = defineStore('StudentStore', {
    state: () => ({
        student: null,
    }),
    getters: {
        getStudent: (state) => {
            return state.student || JSON.parse(localStorage.getItem(AUTH_KEY))
        }
    },
    actions: {
        register: async function(vm) {
            this.student = null

            await axios.post(`${API_URL}/student/register`, vm)
                .then(res => {
                    if(res.data == 1) {
                        this.student = vm
                        localStorage.setItem(AUTH_KEY, JSON.stringify(vm))
                    }
                    else throw new Error("unable to register user")
                })
                .catch(err => {
                    throw err
                })
        },
        logout: function() {
            this.student = null

            localStorage.removeItem(AUTH_KEY)
        }
    }
});