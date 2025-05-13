<script setup lang="ts">
import { ref } from 'vue'
import { addAnnouncement } from '../../api/announcement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const title = ref('')
const content = ref('')

const emit = defineEmits(['close', 'refreshAnnouncements'])

const createAnnouncement = async () => {
  try {
    const announcement = { 
      title: title.value, 
      content: content.value 
    }
    await addAnnouncement(announcement)
    title.value = ''
    content.value = ''
    emit('close')
    emit('refreshAnnouncements')  
  } catch (error) {
    console.error('Error:', error)
    // Consider using a toast notification here instead of alert
    alert('Failed to create announcement. Please try again.')
  }
}

const handleCancel = () => {
  title.value = ''
  content.value = ''
  emit('close')
}
</script>

<template>
  <Dialog :open="true" @update:open="handleCancel">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-primary">
          Create New Announcement
        </DialogTitle>
      </DialogHeader>
      
      <form @submit.prevent="createAnnouncement" class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Title</Label>
          <Input 
            id="title" 
            v-model="title" 
            placeholder="Enter announcement title"
            required
          />
        </div>
        
        <div class="space-y-2">
          <Label for="content">Content</Label>
          <Textarea
            id="content"
            v-model="content"
            placeholder="Write your announcement content here..."
            class="min-h-[120px]"
            required
          />
        </div>
        
        <div class="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline"
            @click="handleCancel"
          >
            Cancel
          </Button>
          <Button type="submit">
            Publish Announcement
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>