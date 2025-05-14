<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
    
    <div class="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-12 min-h-[calc(100vh-4rem)]">
      <div class="w-full lg:w-1/2 flex justify-center">
        <img 
          src="@/assets/Code typing-bro.svg" 
          alt="Typing illustration" 
          class="w-[clamp(10rem,30vw,40rem)] animate-float"
        >
      </div>

      <Card class="w-full lg:w-1/2 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle class="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            WELCOME TO CCS LABORATORY SITIN MONITORING SYSTEM
          </CardTitle>
        </CardHeader>
        <CardContent class="mt-6">
          <CardDescription class="text-lg md:text-xl text-center text-gray-300 italic">
            Where you can monitor the CCS Laboratory Status in real-time
          </CardDescription>
          
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              @click="$router.push('/login')"
              variant="default" 
              size="lg"
              class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition-all"
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>