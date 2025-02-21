<script setup lang="ts">
import { ref } from 'vue'
import { findStudent, getStudent } from '../../api/student';
import { useRouter } from 'vue-router';

import { reactive } from 'vue';

import { useStudentStore } from '@/stores/student.store';

const router = useRouter();
const studentStore = useStudentStore();


const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  
  try {
    const student = {
      username: username.value,
      password: password.value
    };
    console.log(student)
    
    const response = await findStudent(student);
    console.log("123")

    if (response && response.success) {
      console.log("Student found");
      
      studentStore.setStudent(response.studentInfo);
      // Store username in localStorage
      // localStorage.setItem('username', username.value);

      router.push('/dashboard'); // Redirect to dashboard
    } else {
      alert("Invalid username or password");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred");
  }
}

const handlePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-[#2e2e2e] w-4/11 h-3/4 flex flex-col justify-center items-center rounded-2xl gap-5 text-center">
      <img src="@/assets/Code typing-bro.svg" alt="CCS" width="200" class="cursor-pointer -mt-10" />
      <form class="w-3/5">
        <div class="flex flex-col gap-5 text-yellow-100 justify-center">
          <input type="text" placeholder="username" v-model="username" class="input" />
          <div class="flex text-yellow-100 justify-between">
            <input
              id="passwordinput"
              :type="showPassword ? 'text' : 'password'"
              placeholder="password"
              v-model="password"
              class="input w-full"
            />
            <div>
              <i
                v-if="!showPassword"
                class="pi pi-eye-slash absolute -ml-5 cursor-pointer"
                style="font-size: 15px"
                @click.prevent="handlePasswordVisibility"
              ></i>
              <i
                v-if="showPassword"
                class="pi pi-eye absolute -ml-5 cursor-pointer"
                style="font-size: 15px"
                @click.prevent="handlePasswordVisibility"
              ></i>
            </div>
          </div>
          <button
            @click.prevent="handleLogin"
            class="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
          >
            LOGIN
          </button>
          <p class="text-center">
            Don't have an account? <a href="/register" class="text-violet-100">Register</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
