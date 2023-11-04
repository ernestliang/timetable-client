import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useAttendanceStore = defineStore('AttendanceStore', {
    state: () => ({
    }),
    getters: {
    },
    actions: {
        insert: async function(vm) {
            await axios.post(`${API_URL}/attendance`, vm)
                .then(res => {
                    return res.data
                })
                .catch(err => {
                    throw err
                })
        }
    }
});