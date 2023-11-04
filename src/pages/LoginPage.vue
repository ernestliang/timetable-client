<template>
    <div class="container pt-5">
        <div class="row text-center justify-content-center">
            <div class="col-12 col-md-6 col-xl-5">
                <div class="card border-0 rounded-4">
                    <div class="card-body p-3 p-md-4 p-xl-5">
                        <div class="row">
                            <div class="col-12">
                                <div class="mb-4">
                                    <h3>Timetable</h3>
                                </div>
                            </div>
                        </div>

                        <div class="row gy-3 overflow-hidden">
                            <div class="col-12">
                                <div class="form-floating mb-1">
                                    <input type="email" class="form-control" name="email" id="email" v-model="email" :disabled="isLoading">
                                    <label for="email" class="form-label">Email</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="d-grid">
                                    <button class="btn btn-primary btn-lg" @click="login" :disabled="isLoading || !email">
                                        <span v-if="!isLoading">Log in</span>
                                        <span v-if="isLoading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toastification'
    import Swal from 'sweetalert2'

    import { getMessaging, getToken } from "firebase/messaging";   /PWA/

    import { useStudentStore } from '@/stores/StudentStore'

    const email = ref(null)
    const isLoading = ref(false)

    const studentStore = useStudentStore()
    const toast = useToast()
    const router = useRouter()

    async function login() {
        let fbToken = null;

        // --- ======================= P W A   F E A T U R E S ====================== --- //
        // 1. firebase token
        try
        {
            isLoading.value = true

            const messaging = getMessaging();
            await getToken(messaging, { vapidKey: 'BO8A37VfAfudxC1c1l_gKXW1TWXl1JActDqVi9QnYWM-AlPuvIpbEXB_dNXTlNKcocceJ5KGiGstXnZyGuGKDMg'})
                .then(async (result) => {
                    console.log("currentToken:" + result)

                    toast.info('Firebase Token received ! Notifications Enabled !')
                    fbToken = result
                })
                .catch((err) => {
                    Swal.fire({ icon: 'error', text: `An error occurred while retrieving notification token. ${err.message}`})
                });
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }

        if(!fbToken) {
            toast.warning("No tokens available. Notifications not enabled")
        }
        // --- ======================= /P W A   F E A T U R E S ====================== --- //
    
        try {
            isLoading.value = true

            await studentStore.register({email: email.value, token: fbToken});
            if(studentStore.getStudent != null) {
                toast.success("registration successful");
            }
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }   
        finally {
            isLoading.value = false
        }        
        
        // -- still proceed with token and registration (for simplicty sake)        
        router.push("/timetable")
    }

    onMounted(() => {
        if(studentStore.getStudent != null) {
            router.push("/timetable")
        }
    })
</script>