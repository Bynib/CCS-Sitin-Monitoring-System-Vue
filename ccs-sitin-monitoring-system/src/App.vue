<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/NavbarView.vue'
import "@fontsource/montserrat/500.css"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

const currentRoute = useRoute();

function isLandingRoute(){
  const landingRoutes = ['/', '/login','/register'];
  return landingRoutes.includes(currentRoute.path);
}
console.log(currentRoute.path)
localStorage.setItem('vueuse-color-scheme', 'dark');
</script>

<template>
  <Toaster />
  <SidebarProvider v-if="!isLandingRoute()">
    <Navbar/>
    <main class="w-screen">
      <RouterView />
    </main>
  </SidebarProvider>
  <RouterView v-else/>
</template>

<style scoped></style>
