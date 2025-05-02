<script lang="ts" setup>
import { getFiles, addFile, removeFile } from '@/../api/file'
import { onMounted, ref } from 'vue'

const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const deleting = ref(false)
const uploadStatus = ref('')
const deleteStatus = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

interface FileDetails {
  id: number
  filename: string
  filedata: string
}

const files = ref<FileDetails[]>([])

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const MAX_FILE_SIZE = 45 * 1024 * 1024 // 45MB

const handleFileUpload = async () => {
  if (!selectedFile.value) {
    console.warn('No file selected.')
    alert('Please select a file to upload.')
    return
  }

  const file = selectedFile.value

  if (file.size > MAX_FILE_SIZE) {
    alert(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)}. Please upload a smaller file.`)
    return
  }
  try {
    uploading.value = true
    console.log(uploading.value)
    uploadStatus.value = 'Uploading...'
    const arrayBuffer = await file.arrayBuffer()
    const base64String = arrayBufferToBase64(arrayBuffer)

    console.log('Base64:', base64String.slice(0, 100), '...')

    await addFile({
      filename: file.name,
      filedata: base64String,
    })

    files.value = (await getFiles()).reverse()

    uploading.value = false
    console.log(uploading.value)

    uploadStatus.value = 'Uploaded'
    setTimeout(() => {
      uploadStatus.value = ''
    }, 2000)
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error: any) {
    console.error(error)
    if (error?.response?.data?.sqlMessage?.includes('max_allowed_packet')) {
      alert('File too large to be uploaded to the server. Please upload a smaller file.')
    } else {
      alert('An error occurred while uploading. Please try again.')
    }
  }
}

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new Blob([bytes], { type: mimeType })
}

const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} bytes`
  } else if (size < 1048576) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / 1048576).toFixed(2)} MB`
  }
}

const downloadFile = (file: FileDetails) => {
  const base64String = file.filedata

  try {
    const blob = base64ToBlob(base64String, 'application/pdf')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

const deleteFile = async (id: number, filename: string) => {
  const confirmDelete = confirm(`Are you sure you want to delete "${filename}"?`)
  if (confirmDelete){

    try {
      deleting.value = true
      deleteStatus.value = 'Deleting...'
      const response = await removeFile(id)
      console.log(response)
    files.value = (await getFiles()).reverse()
    deleting.value = false
    deleteStatus.value = 'Deleted'
    setTimeout(() => {
      deleteStatus.value = ''
    },2000)
  } catch (error) {
    console.error(error)
  }
}
}

onMounted(async () => {
  files.value = (await getFiles()).reverse()
  console.log(files.value[0].filename)
})
</script>

<template>
  <div class="flex flex-col items-center h-screen w-screen text-white gap-10">
    <div class="w-7/10 flex flex-row mt-30 justify-end gap-5">
      <label>Upload File (Max file size: 45 MB):</label>

      <input
        ref="fileInput"
        type="file"
        @change="onFileSelected"
        class="input mb-4 w-100 cursor-pointer hover:border-blue-500"
      />
      <button
        @click="handleFileUpload"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Upload
      </button>
    </div>
    <p v-if="deleteStatus" :class="deleteStatus === 'Deleted' ? 'text-green-500' : 'text-blue-500'">{{ deleteStatus }} {{deleteStatus === 'Deleted' ? '✅' : ''}}</p>
    <p v-if="uploadStatus" :class="uploadStatus === 'Uploaded' ? 'text-green-500' : 'text-blue-500'">{{ uploadStatus }} {{uploadStatus === 'Uploaded' ? '✅' : ''}}</p>
    <p v-if="files.length === 0">Fetching files...</p>
    <div v-else class="w-7/12 h-screen overflow-scroll">
      <table class="table-auto w-full">
        <thead class="h-10 border-b border-white">
          <tr class="sticky top-0 bg-[#181818]">
            <td>Filename</td>
            <td>Size</td>
            <td class=" w-1/15 text-center">Action</td>
          </tr>
        </thead>
        <tbody class="">
          <tr
            v-for="(file, index) in files"
            :key="file.filename"
            :class="index % 2 ? '  rounded-lg h-10' : ' bg-gray-800 rounded-lg h-10'"
          >
          <td class="p-3">
            <template v-if="file.filename.endsWith('.pdf')">
              <i class="pi pi-file-pdf text-orange-500"></i>
            </template>
            <template v-if="file.filename.endsWith('.docx')">
              <i class="pi pi-file-word text-blue-500"></i>
            </template>
            <template v-if="file.filename.endsWith('.xlsx')">
              <i class="pi pi-file-excel text-blue-500"></i>
            </template>
            {{ file.filename }}</td>
            <td>{{ formatFileSize((file.filedata.length * 3) / 4) }}</td>
            <td class="w-1/15 text-blue-400 text-center">
              <div class="w-full flex justify-between px-2">

                <i class="pi pi-download cursor-pointer" @click="downloadFile(file)"></i>
                <i class="pi pi-trash cursor-pointer text-red-400" @click="deleteFile(file.id, file.filename)"></i>
                
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
