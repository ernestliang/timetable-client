<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <scan-dialog v-if="isDialogVisible" :model="attendance" @dialog-closed="dialogClosed"></scan-dialog>
    </transition>

    <div class="text-center pt-3">
        <h2>Timetable</h2>
        <ul class="nav navbar-nav pt-4">
            <li class="nav-item">
                <select v-model="selectedCourse" class="form-select">
                    <option disabled value="0">Please select a course</option>
                    <option v-for="(course, index) in courses" :key="index" :value="course.courseId">{{course.courseName}}</option>
                </select>
            </li>
        </ul>
    </div>

    <!-- Timetable Accordion Display -->
    <div class="accordion pt-3" id="accordionExample">
        <div class="accordion-item" v-for="dayTable in timetable">
            <h2 class="accordion-header" :id="dayTable.name">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapse${dayTable.name}`" aria-expanded="true" :aria-controls="`collapse${dayTable.name}`" :disabled="dayTable.events.length == 0">
                    <span v-if="dayTable.events.length > 0" class="badge rounded-pill bg-success">{{ dayTable.events.length }}</span>
                    &nbsp;{{ dayTable.name }}
                </button>
            </h2>
            <div :id="`collapse${dayTable.name}`" class="accordion-collapse collapse" :aria-labelledby="dayTable.name" data-bs-parent="#accordionExample" ref="accordion">
                <div class="accordion-body">
                    <div class="row d-flex justify-content-center">
                        <div class="col-12 col-md-10">
                            <div class="main-card card">
                                <div class="text-center">
                                    <p class="small text-warning">click on subject to scan attendance</p>
                                </div>
                                <div class="card-body">
                                    <!-- <h5 class="card-title">User Timeline</h5> -->
                                    <div class="scroll-area">
                                        <div class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                                            <div class="vertical-timeline-item vertical-timeline-element" v-for="evt in dayTable.events" :key="evt.id">
                                                <div class="vertical-timeline-element-content" @click="scanAttendance(evt)"> 
                                                    <h6 class="timeline-title">{{ evt.subjectName }}</h6>
                                                    <p>{{ evt.endTime }}</p>
                                                    <p>{{ evt.locationCode }}</p>
                                                    <span class="vertical-timeline-element-date">{{ evt.startTime }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div>
            </div>
        </div>
    </div>
    <!--  Timetable Accordion Display -->
</template>
<script setup>

    import {ref, onMounted, watch} from 'vue'
    import {useTimetableStore} from '../stores/TimetableStore'
    import {useStudentStore} from '../stores/StudentStore'
    import {useCourseStore} from '../stores/CourseStore'
    import Loading from 'vue-loading-overlay'
    import Swal from 'sweetalert2'
    import ScanDialog from '../components/ScanDialog.vue'

    const timetableStore = useTimetableStore()
    const courseStore = useCourseStore()
    const studentStore = useStudentStore()

    const isLoading = ref(false)
    const isDialogVisible = ref(false)

    const attendance = ref({})
    const courses = ref(null)
    const timetable = ref([])
    const index = ref(null)
    const selectedCourse = ref(0)

    async function loadCourses() {
        try {
            isLoading.value = true
            await courseStore.retrieveAll()
            courses.value = courseStore.getCourses
        }
        catch(err) {
            Swal.fire({icon: 'error', text: err.message})
        }
        finally{
            isLoading.value = false
        }
    }

    async function loadTimetable(courseId) {
        try {
            isLoading.value = true
            await timetableStore.retrieveByCourse(courseId)
            timetable.value = timetableStore.getTimetableByDay
        }
        catch(err) {
            Swal.fire({icon: 'error', text: err.message})
        }
        finally{
            isLoading.value = false
        }
    }

    function scanAttendance(evt) {
        debugger
        attendance.value = {
            subjectId: evt.subjectId,
            subjectName: evt.subjectName,
            studentEmail: studentStore.getStudent.email
        }
        isDialogVisible.value = true
    }
    function dialogClosed() {
        isDialogVisible.value = false
    }

    watch(selectedCourse, async (newVal, oldVal) => {
        await loadTimetable(newVal)
    })


    onMounted(async() => {
        await loadCourses()
    })


</script>
<style scoped lang="scss">
    .small {
        font-size: 12px;
    }
    .scroll-area {
        overflow-x: hidden;
        height: auto;
    }

    .vertical-timeline {
        width: 100%;
        position: relative;
        padding: 1rem 0 0rem;
    }
    .vertical-timeline::before {
        content: '';
        position: absolute;
        top: 0;
        left: 78px;
        height: 100%;
        width: 4px;
        background: #e9ecef;
        border-radius: .25rem;
    }
    .vertical-timeline-element {
        position: relative;
        margin: 0;
    }
    .vertical-timeline-element-content {
        position: relative;
        margin-left: 90px;
        font-size: .8rem;
        > p:nth-child(3) {
            color: darkorange;
            font-weight: 700;
            float: right;
        }
    }

    .vertical-timeline-element-content .timeline-title {
        font-size: .73rem;
        text-transform: uppercase;
        margin: 0 0 0rem;
        padding: 2px 0 0;
        font-weight: bold;
    }

    .vertical-timeline-element-content .vertical-timeline-element-date {
        display: block;
        position: absolute;
        left: -90px;
        top: 0;
        padding-right: 10px;
        text-align: right;
        color: #adb5bd;
        font-size: 1.08rem;
        white-space: nowrap;
    }

    .vertical-timeline-element-content:after {
        content: "";
        display: table;
        clear: both;
    }
</style>