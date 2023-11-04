<template>
    <div class="p-2">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <!-- 
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a class="navbar-brand" href="#">HELP</a>
                </div> 
                -->

                <a class="navbar-brand">0.0.5</a>
                <div class="d-flex justify-content-between gap-3" v-if="studentStore.getStudent">
                    <div class="text-light">{{ studentStore.getStudent.email }}</div>
                    <div>
                        <button type="button" class="btn btn-sm btn-primary" @click="logout">logout</button>
                    </div>
                </div>
            </div>
        </nav>
        
        <div class="container">
            <router-view></router-view>
        </div>
    </div>

    <!-- --- ======================= P W A   F E A T U R E S ====================== --- -->
    
    <footer class="footer mt-auto py-3 bg-light" v-if="deferredPrompt && studentStore.getStudent">
        <div class="container text-center">
            <button type="button" class="btn btn-danger" @click="installApp">Install on your device</button>
        </div>
    </footer> 
   
    <!-- --- ======================= /P W A   F E A T U R E S ===================== --- -->
</template>

<script setup>
    import Swal from 'sweetalert2'
    import {ref, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import { useStudentStore } from './stores/StudentStore';
    import {useUserStore} from './stores/UserStore'
    const studentStore = useStudentStore()
    const userStore = useUserStore()
    const router = useRouter()

    import {initializeApp} from 'firebase/app'
    // If no error when OPENING to the LOGIN page, then initializeApp is created successfully   
    const firebaseConfig = initializeApp({
        apiKey: "AIzaSyB6pVnU_Ln2OhILdk4ONMgNUB97tswnRZM",
        authDomain: "vue-timetable-project.firebaseapp.com",
        projectId: "vue-timetable-project",
        storageBucket: "vue-timetable-project.appspot.com",
        messagingSenderId: "85946573826",
        appId: "1:85946573826:web:653ee4ffcff0b6f3d9f31b"
    });

    // ---1. PWA Installation Prompt
    const deferredPrompt = ref(null)
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
    });
    async function installApp() {
        deferredPrompt.value.prompt()
        deferredPrompt.value = null
    }

    //  --- 2. Foreground notification display
    import { getMessaging, onMessage } from "firebase/messaging"
    
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
        console.log('Message received. ', JSON.stringify(payload))

        let msgData = payload.notification || payload.data
        Swal.fire({
            icon: 'info',
            title: msgData.title,
            text: msgData.body
        })
    });

    // -- Private Method
    function logout() {
        studentStore.logout()
        router.push("/login")
    }

</script>