<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updateAnnouncement } from '../../api/announcement'
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

interface Announcement {
  id: number
  title: string
  content: string
}

const props = defineProps<{
  announcement: Announcement
}>()

const emit = defineEmits(['close', 'refreshAnnouncements'])

const title = ref('')
const content = ref('')

onMounted(() => {
  title.value = props.announcement.title
  content.value = props.announcement.content
})

const handleEdit = async () => {
  try {
    await updateAnnouncement(props.announcement.id, { 
      title: title.value, 
      content: content.value 
    })
    emit('close')
    emit('refreshAnnouncements')
  } catch (error) {
    console.error('Error updating announcement:', error)
    // Consider using a toast notification here
    alert('Failed to update announcement. Please try again.')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Dialog :open="true" @update:open="handleClose">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-primary">
          Edit Announcement
        </DialogTitle>
      </DialogHeader>
      
      <form @submit.prevent="handleEdit" class="space-y-4">
        <div class="space-y-2">
          <Label for="edit-title">Title</Label>
          <Input 
            id="edit-title" 
            v-model="title" 
            placeholder="Announcement title"
            required
          />
        </div>
        
        <div class="space-y-2">
          <Label for="edit-content">Content</Label>
          <Textarea
            id="edit-content"
            v-model="content"
            placeholder="Announcement content"
            class="min-h-[120px]"
            required
          />
        </div>
        
        <div class="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline"
            @click="handleClose"
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>