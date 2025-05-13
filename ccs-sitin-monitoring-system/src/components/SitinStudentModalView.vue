<script setup lang="ts">
import { addSitin, findSitin } from '../../api/sitin'
import { ref, defineEmits, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Define both close and sitin-success events
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'sitin-success'): void
}>()

interface Student {
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  course: string
  yearlevel: string
  sessions: string
}

interface Sitin {
  sitin_id: number
  idno: string
  purpose: string
  laboratory: string
  date: string
  loggedout: string
}

const props = defineProps<{
  student: Student
}>()

const purpose = ref('')
const laboratory = ref('')
const sitins = ref<Sitin[]>([])
const isDisabled = ref(false)
const errorMessage = ref('')
const formError = ref('')
const showConfirmDialog = ref(false)

const purposes = [
  'C Programming', 
  'Java Programming', 
  'C# Programming', 
  'Systems Integration and Architecture', 
  'Embedded Systems & IoT', 
  'Digital Logic & Design', 
  'Computer Application', 
  'Database', 
  'Project Management', 
  'Python Programming', 
  'Mobile Application', 
  'Web Design', 
  'PHP Programming'
]

const laboratories = [517, 524, 526, 528, 530, 542, 544]

const isFormValid = computed(() => {
  return purpose.value && laboratory.value && !isDisabled.value
})

onMounted(async () => {
  sitins.value = await findSitin(props.student.idno)
  if (sitins.value.some(s => !s.loggedout)) {
    isDisabled.value = true
    errorMessage.value = 'Student has an active sit-in session'
  }
})

const confirmSitin = () => {
  if (!isFormValid.value) {
    formError.value = 'Please select both purpose and laboratory'
    return
  }
  showConfirmDialog.value = true
}

const handleSitin = async () => {
  showConfirmDialog.value = false
  formError.value = ''

  const student = {
    idno: Number(props.student.idno),
    purpose: purpose.value,
    laboratory: Number(laboratory.value)
  };

  try {
    const result = await addSitin(student);
    if (!result.success) {
      errorMessage.value = 'Student is currently sitting in and has not logged out!'
      isDisabled.value = true
      return
    }
    emit('close')
    emit('sitin-success') // Notify parent to refresh data
  } catch (error) {
    console.error("Error adding sitin:", error);
    errorMessage.value = 'Failed to add sit-in'
  }
};

const handleCancel = () => {
  emit('close')
}
</script>

<template>
  <Card class="fixed top-1/2 left-1/2 w-[90%] max-w-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
    <CardHeader>
      <CardTitle class="text-2xl">Student Sitin Registration</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <!-- Error messages -->
        <div v-if="errorMessage" class="mb-4">
          <Alert variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>
        </div>
        <div v-if="formError" class="mb-4">
          <Alert variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertDescription>{{ formError }}</AlertDescription>
          </Alert>
        </div>

        <!-- Student info -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">ID Number</p>
            <p class="font-medium">{{ student.idno }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Name</p>
            <p class="font-medium">
              {{ student.lastname }}, {{ student.firstname }} 
              <span v-if="student.middlename" class="text-muted-foreground">{{ student.middlename.charAt(0) + '.' }}</span>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Course</p>
            <Badge variant="outline">{{ student.course }}</Badge>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Year Level</p>
            <Badge variant="outline">{{ student.yearlevel }}</Badge>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Remaining Sessions</p>
          <Badge :variant="Number(student.sessions) > 0 ? 'default' : 'destructive'">
            {{ student.sessions }}
          </Badge>
        </div>

        <Separator class="my-4" />

        <!-- Form fields -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="purpose" class="text-sm font-medium">Purpose <span class="text-red-500">*</span></label>
            <Select v-model="purpose" :disabled="isDisabled" required>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="purpose in purposes" 
                  :key="purpose" 
                  :value="purpose"
                >
                  {{ purpose }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <label for="laboratory" class="text-sm font-medium">Laboratory <span class="text-red-500">*</span></label>
            <Select v-model="laboratory" :disabled="isDisabled" required>
              <SelectTrigger>
                <SelectValue placeholder="Select laboratory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="lab in laboratories" 
                  :key="lab" 
                  :value="String(lab)"
                >
                  Lab {{ lab }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            @click="handleCancel"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            @click="confirmSitin"
            :disabled="!isFormValid"
          >
            Register Sitin
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Confirmation Dialog -->
  <AlertDialog v-model:open="showConfirmDialog">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Sitin Registration</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to register this sit-in for:
          <div class="mt-2 space-y-1">
            <p><strong>Student:</strong> {{ student.lastname }}, {{ student.firstname }} ({{ student.idno }})</p>
            <p><strong>Purpose:</strong> {{ purpose }}</p>
            <p><strong>Laboratory:</strong> Lab {{ laboratory }}</p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="handleSitin">Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>