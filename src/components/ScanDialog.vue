<template>
    <div class="overlay">
        <div class="modal-display">
            <div class="text-center">
                <h6>Scan your Attendance</h6>
            </div>

            <div class="container-fluid p-3">
                <div class="row mb-3">
                    <div class="col-12 text-center">
                        <h5 class="fw-bold">{{ attendance.subjectName }}</h5>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-12" style="position: relative;">
                        <loading :active="isLoading" :is-full-page="false" />
                        <qrcode-stream @detect="onDetect" @camera-on="onCameraOn" @error="onCameraError"></qrcode-stream>
                    </div>
                    <div class="col-12 text-center pt-2">
                        <p>** Scan any qrCode. This is a test</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="closeDialog">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

    import {ref, onMounted, toRef} from 'vue'
    import {toastInjectionKey, useToast} from 'vue-toastification'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import {useAttendanceStore} from '../stores/AttendanceStore'

    const toast = useToast()

    const isLoading = ref(false)
    const props = defineProps(['model'])
    const attendance = toRef(props.model)
    const emit = defineEmits(['dialogClosed'])
    const attendanceStore = useAttendanceStore()

    async function onDetect(detectedCodes) {
        let result = JSON.stringify(detectedCodes.map(code => code.rawValue))
        if(result) {
            try {
                isLoading.value = true
                await attendanceStore.insert({
                    subjectId: attendance.value.subjectId,
                    email: attendance.value.studentEmail
                })
                toast.success("Attendance Updated Successfully")
            }
            catch(err) {
                Swal.fire({
                    icon: 'error',
                    text: err.message
                })
            }
            finally {
                isLoading.value = false
                closeDialog()
            }
        }
        
    }

    function onCameraOn() {
        isLoading.value = false
    }

    function onCameraError(err) {
        isLoading.value = false
        Swal.fire({
            icon: 'error',
            title: err.message,
            text: "Error text here"
        })
    }

    function closeDialog() {
        emit('dialogClosed')
    }

    onMounted(async() => {
        const ppp = props.model
        debugger;

        isLoading.value = true
    })
</script>
<style>

</style>