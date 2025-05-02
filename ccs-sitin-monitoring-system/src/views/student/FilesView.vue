<script setup lang="ts">
import { getFiles } from '@/../api/file'
import { onMounted, ref } from 'vue'

interface File {
  filename: string
  filedata: string
}

const files = ref<File[]>([])

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new Blob([bytes], { type: mimeType })
}

const downloadFile = (file: File) => {
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
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} bytes`
  } else if (size < 1048576) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / 1048576).toFixed(2)} MB`
  }
}

onMounted(async () => {
  files.value = (await getFiles()).reverse()
  console.log(files.value[0].filename)
})
</script>

<template>
  <div class="flex flex-col items-center h-screen w-screen text-white">
    <div class="mt-30">Files in DB:</div>
    <p v-if="files.length === 0">Fetching...</p>
    <div v-else class="w-7/12 overflow-y-auto">

      <table class="table-auto w-full">
        <tbody>

        <tr class="sticky top-0 bg-[#181818] text-lg">
          <td>Filename</td>
          <td>Size</td>
          <td class=" w-1/15 text-center">Action</td>
        </tr>
        <tr v-for="(file,index) in files" :key="file.filename" :class="index % 2 ? '  rounded-lg h-10' : ' bg-gray-800 rounded-lg h-10'">
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
          <td class="cursor-pointer text-blue-400 text-center">
            <i class="pi pi-download" @click="downloadFile(file)"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>    
  </div>
</template>
