<script setup>
import { ref, reactive } from 'vue';
import { useStudentStore } from '@/stores/student.store';


const studentStore = useStudentStore();

const userDetails = reactive({
  idno: studentStore.student.idNo,
  firstname: studentStore.student.firstName,
  middlename: studentStore.student.middleName,
  lastname: studentStore.student.lastName,
  email: studentStore.student.email,
  password: studentStore.student.password,
  course: studentStore.student.course,
  yearlevel: studentStore.student.yearLevel,
  username: studentStore.student.username
});

const isDisabled = ref(true)

const handleEdit = () => {
  isDisabled.value = false
}

</script>

<template>
  <div class="flex flex-row items-center justify-center h-screen w-screen bg-gray-700">
  <div class="flex flex-row items-center justify-center h-screen w-screen bg-gray-700">
    <div class="mb-45" style="width: 15rem; height: 15rem;">
      <img src="@/assets/avatar.jpeg" alt="..." style="border-radius: 50%; object-fit:cover; width: 100%; height: 100%;">
    </div>
    <div class="ml-5 text-white flex flex-col gap-5">
      
      <div class="flex justify-between gap-3">
        <label for="idno"><strong>ID Number:</strong></label>
        <input class="input" :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''" type="text" :value="userDetails.idno" :disabled="isDisabled">
      </div>
      <div class="flex justify-between gap-3">
        <label for="username"><strong>Username:</strong></label>
        <input class="input" :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''" type="text" :value="userDetails.username">
      </div>
      <div class="flex justify-between gap-3">
        <label for="firstname"><strong>Firstname:</strong></label>
        <input class="input" :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''" type="text" :value="userDetails.firstname">
      </div>
      <div class="flex justify-between gap-3">
        <label for="middlename"><strong>MiddleName:</strong></label>
        <input class="input" :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''" type="text" :value="userDetails.middlename">
      </div>
      <div class="flex justify-between gap-3">
        <label for="lastname"><strong>Lastname:</strong></label>
        <input class="input" :class="!isDisabled ? 'border-b-green-500 text-green-300' : ''" type="text" :value="userDetails.lastname">
      </div>
      <div class="flex justify-between gap-3">
        <label for="course"><strong>Course:</strong></label>
        <!-- <div class ="w-"> -->
          
          <select name="course" id="course" class="select mr-29">
            <option value="" class="option" selected disabled>{{userDetails.course}}</option>
            <option value="BSIT" class="option">BSIT</option>
            <option value="BSCS" class="option">BSCS</option>
            <option value="BSBA" class="option">BSBA</option>
            <option value="BSHM" class="option">BSHM</option>
            <option value="BSED" class="option">BSED</option>
            <option value="BSBA" class="option">BSBA</option>
  
          </select>
        <!-- </div> -->
      </div>
      <div class="flex justify-between gap-3">
        <label for="yearlevel"><strong>Year Level:</strong></label>
        <select name="yearlevel" id="yearlevel" class="select mr-38">
          <option value="" class="option" selected disabled>{{userDetails.yearlevel}}</option>
          <option value="1" class="option">1</option>
          <option value="2" class="option">2</option>
          <option value="3" class="option">3</option>
          <option value="4" class="option">4</option>
          <option value="5" class="option">5</option>
        </select>
      </div>
      <button @click="handleEdit" class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400">EDIT</button>
      <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400">SAVE</button>
    </div>
  </div>
  </div>
</template>
