<script setup lang="ts">
import { ref } from 'vue'
import { findStudent, getStudent } from '../../api/student'
import { useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-vue-next'
import NavbarLandingView from '@/components/NavbarLandingView.vue'
import { toast } from 'vue-sonner'

const router = useRouter()
const studentStore = useStudentStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    isLoading.value = true
    const student = {
      username: username.value,
      password: password.value,
    }

    const response = await findStudent(student)

    if (response && response.success) {
      studentStore.setStudent(response.studentInfo)

      if (String(studentStore.student.isAdmin) === '1') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your username and password',
      })
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error('Login failed', {
      description: 'An error occurred during login',
    })
  } finally {
    isLoading.value = false
  }
}

const handlePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
    <NavbarLandingView />

    <div class="container mx-auto flex items-center justify-center px-4 py-12">
      <Card class="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader class="space-y-1">
          <img
            src="@/assets/Code typing-bro.svg"
            alt="Login Illustration"
            class="w-40 h-40 mx-auto mb-4"
          />
          <CardTitle class="text-2xl font-bold text-center text-yellow-300">
            Welcome Back
          </CardTitle>
          <p class="text-sm text-center text-gray-400">
            Enter your credentials to access your account
          </p>
        </CardHeader>

        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username" class="text-gray-300">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              v-model="username"
              class="bg-gray-700 border-gray-600 text-white focus-visible:ring-yellow-400"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password" class="text-gray-300">Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                v-model="password"
                class="bg-gray-700 border-gray-600 text-white focus-visible:ring-yellow-400 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                @click="handlePasswordVisibility"
              >
                <Eye v-if="showPassword" class="h-4 w-4 text-gray-400" />
                <EyeOff v-else class="h-4 w-4 text-gray-400" />
                <span class="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-4">
          <Button
            class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition-colors"
            :disabled="isLoading"
            @click="handleLogin"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>

          <p class="text-sm text-center text-gray-400">
            Don't have an account?
            <RouterLink
              to="/register"
              class="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Register here
            </RouterLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
