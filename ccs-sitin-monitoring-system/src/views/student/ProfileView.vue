<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStudentStore } from '@/stores/student.store'
import { updateStudent } from '../../../api/student'
import { toast } from 'vue-sonner'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

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

const isDisabled = ref(true)

const handleEdit = () => {
  isDisabled.value = false
}

const handleSubmitEdit = async () => {
  if (
    userDetails.firstname.trim() === '' ||
    userDetails.lastname.trim() === '' ||
    userDetails.email.trim() === '' ||
    userDetails.username.trim() === ''
  ) {
    toast.error('Please fill out all required fields')
    return
  }

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
    await updateStudent(student)
    studentStore.setStudent(student)
    isDisabled.value = true
    toast.success('Profile updated successfully')
  } catch (error) {
    console.error(error)
    toast.error('Failed to update profile')
  }
}
</script>

<template>
  <div class="container mx-auto py-8">
    <Card class="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">
          Student Profile
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div class="flex flex-col items-center gap-4 w-full md:w-auto">
            <Avatar class="h-40 w-40">
              <AvatarImage src="@/assets/avatar.jpeg" />
              <AvatarFallback>
                {{ userDetails.firstname.charAt(0) }}{{ userDetails.lastname.charAt(0) }}
              </AvatarFallback>
            </Avatar>
            <div class="text-center">
              <h3 class="text-xl font-semibold">
                {{ userDetails.firstname }} {{ userDetails.middlename }} {{ userDetails.lastname }}
              </h3>
              <p class="text-sm text-muted-foreground">
                Remaining Sessions: {{ userDetails.sessions }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="idno">ID Number</Label>
                <Input id="idno" v-model="userDetails.idno" disabled />
              </div>
              <div class="space-y-2">
                <Label for="username">Username</Label>
                <Input 
                  id="username" 
                  v-model="userDetails.username" 
                  :disabled="isDisabled"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="firstname">First Name</Label>
                <Input 
                  id="firstname" 
                  v-model="userDetails.firstname" 
                  :disabled="isDisabled"
                />
              </div>
              <div class="space-y-2">
                <Label for="middlename">Middle Name</Label>
                <Input 
                  id="middlename" 
                  v-model="userDetails.middlename" 
                  :disabled="isDisabled"
                />
              </div>
              <div class="space-y-2">
                <Label for="lastname">Last Name</Label>
                <Input 
                  id="lastname" 
                  v-model="userDetails.lastname" 
                  :disabled="isDisabled"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input 
                id="email" 
                v-model="userDetails.email" 
                :disabled="isDisabled"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="course">Course</Label>
                <Select v-model="userDetails.course" :disabled="isDisabled">
                  <SelectTrigger>
                    <SelectValue :placeholder="userDetails.course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BSIT">BSIT</SelectItem>
                    <SelectItem value="BSCS">BSCS</SelectItem>
                    <SelectItem value="BSBA">BSBA</SelectItem>
                    <SelectItem value="BSHM">BSHM</SelectItem>
                    <SelectItem value="BSED">BSED</SelectItem>
                    <SelectItem value="BSED">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="yearlevel">Year Level</Label>
                <Select v-model="userDetails.yearlevel" :disabled="isDisabled">
                  <SelectTrigger>
                    <SelectValue :placeholder="userDetails.yearlevel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end gap-3">
        <Button 
          variant="outline" 
          @click="handleEdit"
          :disabled="!isDisabled"
        >
          Edit Profile
        </Button>
        <Button 
          @click="handleSubmitEdit"
          :disabled="isDisabled"
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>