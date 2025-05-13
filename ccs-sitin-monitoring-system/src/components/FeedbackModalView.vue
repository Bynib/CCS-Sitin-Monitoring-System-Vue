<script setup lang="ts">
import { ref } from 'vue'
import { updateSitinFeedback } from '../../api/sitin'
import { toast } from 'vue-sonner'

// Shadcn components
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const props = defineProps<{
  sitin_id: number
  open: boolean
}>()

const emit = defineEmits(['close', 'submitted'])

const feedback = ref('')
const isSubmitting = ref(false)

const handleCancel = () => {
  feedback.value = ''
  emit('close')
}

const handleFeedback = async () => {
  try {
    isSubmitting.value = true
    await updateSitinFeedback(props.sitin_id, feedback.value)
    
    toast.success('Feedback submitted successfully')
    
    emit('submitted')
    feedback.value = ''
    emit('close')
  } catch (error) {
    toast.error('Failed to submit feedback')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleCancel">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-2xl">Submit Feedback</DialogTitle>
        <DialogDescription>
          Share your experience about this visit
        </DialogDescription>
      </DialogHeader>
      
      <div class="grid gap-4 py-4">
        <Textarea
          v-model="feedback"
          placeholder="How was your experience in the lab?"
          class="min-h-[150px]"
          required
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" @click="handleCancel">
          Cancel
        </Button>
        <Button 
          type="submit"
          @click="handleFeedback"
          :disabled="isSubmitting || !feedback.trim()"
        >
          <span v-if="isSubmitting" class="animate-spin">↻</span>
          <span v-else>Submit Feedback</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>