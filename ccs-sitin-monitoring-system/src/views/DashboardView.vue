<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStudentStore } from '@/stores/student.store'
import { updateStudent } from '../../api/student'

const studentStore = useStudentStore()

const userDetails = reactive({
  idno: studentStore.student.idNo,
  firstname: studentStore.student.firstName,
  middlename: studentStore.student.middleName,
  lastname: studentStore.student.lastName,
  email: studentStore.student.email,
  password: studentStore.student.password,
  course: studentStore.student.course,
  yearlevel: studentStore.student.yearLevel,
  username: studentStore.student.username,
  sessions: studentStore.student.sessions,
})

console.log(userDetails.idno)
console.log(userDetails.sessions)

const isDisabled = ref(true)

const handleEdit = () => {
  isDisabled.value = false
}

const handleSubmitEdit = () => {
  if (
    userDetails.firstname.trim() === '' ||
    userDetails.lastname.trim() === '' ||
    userDetails.email.trim() === '' ||
    userDetails.username.trim() === ''
  ) {
    alert('Please fill out all necesarry fields.')
  } else {
    const student = {
      idno: userDetails.idno,
      firstname: userDetails.firstname,
      middlename: userDetails.middlename,
      lastname: userDetails.lastname,
      email: userDetails.email,
      password: userDetails.password,
      course: userDetails.course,
      yearlevel: userDetails.yearlevel,
      username: userDetails.username,
      sessions: Number(userDetails.sessions),
    }
    try {
      updateStudent(student)
      studentStore.setStudent(student)
      isDisabled.value = true
      alert('Successfully Updated!')
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen w-screen pt-20 gap-3 text-gray-300"
  >
    <!-- <div class="font-extrabold text-[clamp(2rem,5vw,3rem)]">Student Profile</div> -->
    <div class="flex flex-row items-center justify-center w-screen text-gray-300 gap-10">
      <div class="mb-40 flex flex-col items-center gap-5" style="width: 15rem; height: 15rem">
        <img
          src="@/assets/avatar.jpeg"
          alt="..."
          style="border-radius: 50%; object-fit: cover; width: 100%; height: 100%"
        />
        <p class="text-[clamp(1rem,2vw,1.5rem)] text-white font-bold text-center">
          {{ studentStore.student.firstName }} {{ studentStore.student.middleName }}
          {{ studentStore.student.lastName }}
        </p>
        <p>Remaining Sessions: {{ studentStore.student.sessions }}</p>
      </div>
      <div class="ml-5 text-white flex flex-col gap-5 w-2/8">
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="idno"><strong>ID Number:</strong></label>
          <input id="idno" class="w-60" v-model="userDetails.idno" type="text" disabled />
        </div>
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="username"><strong>Username:</strong></label>
          <input
            id="username"
            class="input w-60"
            v-model="userDetails.username"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
            type="text"
            :disabled="isDisabled"
          />
        </div>
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="firstname"><strong>Firstname:</strong></label>
          <input
            id="firstname"
            class="input w-60"
            v-model="userDetails.firstname"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
            type="text"
            :disabled="isDisabled"
          />
        </div>
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="middlename"><strong>MiddleName:</strong></label>
          <input
            id="middlename"
            class="input w-60"
            v-model="userDetails.middlename"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
            type="text"
            :disabled="isDisabled"
          />
        </div>
        <div class="flex justify-between text-[clamp(0.8rem,1vw,1rem)]">
          <label for="lastname"><strong>Lastname:</strong></label>
          <input
            id="lastname"
            class="input w-60"
            v-model="userDetails.lastname"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
            type="text"
            :disabled="isDisabled"
          />
        </div>
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="email"><strong>Email:</strong></label>
          <input
            id="email"
            class="input w-60"
            v-model="userDetails.email"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
            type="text"
            :disabled="isDisabled"
          />
        </div>
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="course"><strong>Course:</strong></label>
          <!-- <div class ="w-"> -->

          <select
            v-model="userDetails.course"
            :disabled="isDisabled"
            name="course"
            id="course"
            class="select text-[clamp(0.8rem,1vw,1rem)] w-60"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
          >
            <option value="" class="option" selected disabled>{{ userDetails.course }}</option>
            <option value="BSIT" class="option">BSIT</option>
            <option value="BSCS" class="option">BSCS</option>
            <option value="BSBA" class="option">BSBA</option>
            <option value="BSHM" class="option">BSHM</option>
            <option value="BSED" class="option">BSED</option>
            <option value="BSBA" class="option">BSBA</option>
          </select>
          <!-- </div> -->
        </div>
        <div class="flex justify-between gap-3 text-[clamp(0.8rem,1vw,1rem)]">
          <label for="yearlevel"><strong>Year Level:</strong></label>
          <select
            v-model="userDetails.yearlevel"
            :disabled="isDisabled"
            name="yearlevel"
            id="yearlevel"
            class="select w-60"
            :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''"
          >
            <option value="" class="option" selected disabled>{{ userDetails.yearlevel }}</option>
            <option value="1" class="option">1</option>
            <option value="2" class="option">2</option>
            <option value="3" class="option">3</option>
            <option value="4" class="option">4</option>
            <option value="5" class="option">5</option>
          </select>
        </div>
        <button
          @click="handleEdit"
          class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
        >
          EDIT
        </button>
        <button
          @click="handleSubmitEdit"
          :class="isDisabled === true ? 'opacity-50 bg-green-500 text-white font-bold py-2 px-4 rounded ' : 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400 '"
          :disabled="isDisabled"
        >
          SAVE
        </button>
      </div>
    </div>
  </div>
</template>
