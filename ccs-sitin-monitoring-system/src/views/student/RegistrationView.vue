<script setup lang="ts">
import { ref } from 'vue'
import { addStudent } from '@/../api/student'
import NavbarLandingView from '@/components/NavbarLandingView.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Eye, EyeOff } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const inputCredentials = ref(false)
const isLoading = ref(false)

const formData = ref({
  idno: '',
  firstname: '',
  midname: '',
  lastname: '',
  email: '',
  course: '',
  yearlevel: '',
  username: '',
  password: ''
})

const showPassword = ref(false)

const handleContinue = () => {
  const { idno, firstname, lastname, email, course, yearlevel } = formData.value
  
  if (!idno || !firstname || !lastname || !email || !course || !yearlevel) {
    toast.error('Validation Error', {
      description: 'Please fill out all required fields'
    })
    return
  }

  if (!Number(idno)) {
    toast.error('Validation Error', {
      description: 'Please enter a valid ID number'
    })
    return
  }

  if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    toast.error('Validation Error', {
      description: 'Please enter a valid email address'
    })
    return
  }

  inputCredentials.value = true
}

const handleAddStudent = async () => {
  try {
    isLoading.value = true
    const student = {
      idno: Number(formData.value.idno),
      firstname: formData.value.firstname,
      middlename: formData.value.midname,
      lastname: formData.value.lastname,
      email: formData.value.email,
      course: formData.value.course,
      yearlevel: formData.value.yearlevel,
      username: formData.value.username,
      password: formData.value.password,
    }

    const response = await addStudent(student)
    console.log('student added', response)
    
    toast.success('Registration Successful', {
      description: 'Your account has been created successfully'
    })
    
    window.location.href = '/login'
  } catch (error) {
    console.error('Error:', error)
    toast.error('Registration Failed', {
      description: 'An error occurred during registration'
    })
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  inputCredentials.value = false
}

const handlePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
    <NavbarLandingView />

    <div class="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card class="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <!-- Personal Information Form -->
        <CardHeader v-if="!inputCredentials">
          <CardTitle class="text-2xl font-bold text-center text-yellow-300">
            Create Your Account
          </CardTitle>
          <p class="text-sm text-center text-gray-400">
            Fill out your personal information
          </p>
        </CardHeader>

        <CardContent v-if="!inputCredentials" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="idno" class="text-gray-300">ID Number</Label>
            <Input
              id="idno"
              type="text"
              placeholder="Enter your ID number"
              v-model="formData.idno"
              class="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="firstname" class="text-gray-300">First Name</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="First name"
                v-model="formData.firstname"
                class="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div class="grid gap-2">
              <Label for="lastname" class="text-gray-300">Last Name</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Last name"
                v-model="formData.lastname"
                class="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div class="grid gap-2">
            <Label for="midname" class="text-gray-300">Middle Name (Optional)</Label>
            <Input
              id="midname"
              type="text"
              placeholder="Middle name"
              v-model="formData.midname"
              class="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div class="grid gap-2">
            <Label for="email" class="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              v-model="formData.email"
              class="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="course" class="text-gray-300">Course</Label>
              <Select v-model="formData.course">
                <SelectTrigger class="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent class="bg-gray-800 border-gray-700">
                  <SelectItem value="BSIT">BSIT</SelectItem>
                  <SelectItem value="BSCS">BSCS</SelectItem>
                  <SelectItem value="BSBA">BSBA</SelectItem>
                  <SelectItem value="BSHM">BSHM</SelectItem>
                  <SelectItem value="BSA">BSA</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="yearlevel" class="text-gray-300">Year Level</Label>
              <Select v-model="formData.yearlevel">
                <SelectTrigger class="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent class="bg-gray-800 border-gray-700">
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                  <SelectItem value="5">5th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter v-if="!inputCredentials" class="flex flex-col gap-4">
          <Button
            class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"
            @click="handleContinue"
          >
            Continue
          </Button>
          <p class="text-sm text-center text-gray-400">
            Already have an account? 
            <RouterLink to="/login" class="font-medium text-yellow-400 hover:text-yellow-300">
              Login here
            </RouterLink>
          </p>
        </CardFooter>

        <!-- Credentials Form -->
        <CardHeader v-if="inputCredentials">
          <div class="flex items-center gap-2 cursor-pointer" @click="handleBack">
            <ArrowLeft class="w-5 h-5 text-yellow-300" />
            <CardTitle class="text-2xl font-bold text-center text-yellow-300">
              Set Credentials
            </CardTitle>
          </div>
          <p class="text-sm text-center text-gray-400">
            Create your username and password
          </p>
        </CardHeader>

        <CardContent v-if="inputCredentials" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username" class="text-gray-300">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              v-model="formData.username"
              class="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div class="grid gap-2">
            <Label for="password" class="text-gray-300">Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password"
                v-model="formData.password"
                class="bg-gray-700 border-gray-600 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                @click="handlePasswordVisibility"
              >
                <Eye v-if="!showPassword" class="h-4 w-4 text-gray-400" />
                <EyeOff v-else class="h-4 w-4 text-gray-400" />
                <span class="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter v-if="inputCredentials" class="flex flex-col gap-4">
          <Button
            class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"
            :disabled="isLoading"
            @click="handleAddStudent"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Registering...' : 'Register' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>