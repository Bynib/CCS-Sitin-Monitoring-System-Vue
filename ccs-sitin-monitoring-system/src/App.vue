<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavbarLandingView from '@/components/NavbarLandingView.vue'
import Navbar from '@/components/NavbarView.vue'
import "@fontsource/montserrat/500.css"

const currentRoute = useRoute();

function isLandingRoute(){
  const landingRoutes = ['/', '/login','/register'];
  return landingRoutes.includes(currentRoute.path);
}
</script>

<template>
  <NavbarLandingView v-if="isLandingRoute()"/>
  <Navbar v-else/>
  
  <RouterView />
</template>

<style scoped></style>
