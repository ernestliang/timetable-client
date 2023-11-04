import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'
import TimetablePage from '../pages/TimetablePage.vue'
import LoginPage from '../pages/LoginPage.vue'

import { useStudentStore } from '../stores/StudentStore'

const routes = [
    {
        path: "/",
        redirect: '/login',
    },
    {
        path: '/login',
        name: "Login",
        component: LoginPage
    },
    {
        path: '/timetable',
        name: "Timetable",
        component: TimetablePage
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach(to => {
    debugger
    const studentStore = useStudentStore()
    if (to.fullPath != '/login' && !studentStore.getStudent) {
        return "/login"
    }
})


export default router