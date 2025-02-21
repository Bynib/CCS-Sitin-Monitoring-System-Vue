<script setup lang="ts">
import { ref } from 'vue'
import {addStudent} from '@/../api/student'

const inputCredentials = ref(false)
const idno = ref('')
const firstname = ref('')
const midname = ref('')
const lastname = ref('')
const email = ref('')
const course = ref('')
const yearlevel = ref('')
const username = ref('')
const password = ref('')

const showPassword = ref(false)

const handleContinue = () => {  
  inputCredentials.value = true

}

const handleAddStudent = async () => {
  const student = {
    idno: Number(idno.value),
    firstname: firstname.value,
    middlename: midname.value,
    lastname: lastname.value,
    email: email.value,
    course: course.value,
    yearlevel: yearlevel.value,
    username: username.value,
    password: password.value
  }
  const response = await addStudent(student)
  console.log("student added", response)
  alert("Successfully Registered! Please login.")
  window.location.href ='/login';
}

const handleBack = () => {
  inputCredentials.value = false
  // username.value = usernameinput.value
  // password.value = passwordinput.value
}

const handlePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div
      class="bg-[#2e2e2e] w-[clamp(2rem,50vw,30rem)] h-3/4 flex flex-col justify-center items-center rounded-2xl gap-5 text-center"
      v-if="inputCredentials === false"
    >
      <!-- <img src="@/assets/Code typing-bro.svg" alt="CCS" width="200" class="cursor-pointer -mt-10" /> -->
      <h1
        class="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-center leading-normal text-yellow-200"
      >
        Create Your Account
      </h1>
      <form class="w-[clamp(1rem,30vw,15rem)] ">
        <div class="flex flex-col gap-5 text-yellow-100 justify-center">
          <input id="idnoinput" type="text" placeholder="idno" v-model="idno" class="input" />
          <input
            id="firstnameinput"
            type="text"
            placeholder="firstname"
            v-model="firstname"
            class="input"
          />
          <input
            id="midnameinput"
            type="text"
            placeholder="midname"
            v-model="midname"
            class="input"
          />
          <input
            id="lastnameinput"
            type="text"
            placeholder="lastname"
            v-model="lastname"
            class="input"
          />
          <input id="emailinput" type="text" placeholder="email" v-model="email" class="input" />
          <select name="course" id="courseinput" v-model="course" class="select">
            <option value="" disabled selected class="option">Course</option>
            <option value="BSIT" class="option">BSIT</option>
            <option value="BSCS" class="option">BSCS</option>
            <option value="BSBA" class="option">BSBA</option>
            <option value="BSHM" class="option">BSHM</option>
            <option value="BSA" class="option">BSA</option>
            <option value="Other" class="option">Other</option>
          </select>
          <select name="yearlevel" id="yearlevelinput" v-model="yearlevel" class="select">
            <option value="" disabled selected class="option">Year Level</option>
            <option value="1" class="option">1</option>
            <option value="2" class="option">2</option>
            <option value="3" class="option">3</option>
            <option value="4" class="option">4</option>
            <option value="5" class="option">5</option>
          </select>
          <button
            class="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
            @click.prevent="handleContinue"
          >
            CONTINUE
          </button>
          <p class="text-center">
            Already have an account? <a href="/login" class="text-violet-100">Login</a>
          </p>
        </div>
      </form>
    </div>
    <div
      class="bg-[#2e2e2e] w-[clamp(2rem,50vw,30rem)]  h-2/4 flex flex-col justify-center items-center rounded-2xl gap-5 text-center absolute"
      v-if="inputCredentials"
    >
      <i
        class="pi pi-arrow-left absolute left-5 top-5 text-white cursor-pointer"
        style="font-size: 20px"
        @click.prevent="handleBack"
      />
      <h1
        class="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-center leading-normal text-yellow-200"
      >
        Set Credentials
      </h1>
      <form class="w-[clamp(1rem,30vw,15rem)] ">
        <div class="flex flex-col gap-5 text-yellow-100 justify-center">
          <input
            id="usernameinput"
            type="text"
            placeholder="username"
            v-model="username"
            class="input"
          />
          <div class="flex text-yellow-100 justify-between ">
            <input
              id="passwordinput"
              :type="showPassword ? 'text' : 'password'"
              placeholder="password"
              v-model="password"
              class="input w-full"
            />
            <div>
              <i
              v-if="showPassword === false"
              class="pi pi-eye-slash absolute -ml-5 cursor-pointer"
              style="font-size: 15px"
              @click.prevent="handlePasswordVisibility"
            ></i>
            <i
              v-if="showPassword === true"
              class="pi pi-eye absolute -ml-5 cursor-pointer"
              style="font-size: 15px"
              @click.prevent="handlePasswordVisibility"
            ></i>
            </div>
            
          </div>
          <button
            @click.prevent="handleAddStudent"
            class="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
          >
            REGISTER
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
