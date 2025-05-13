<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <Card class="bg-gray-800/50 h-[90vh] backdrop-blur-sm border-gray-700">
        <CardHeader class="text-center">
          <CardTitle class="text-3xl sm:text-4xl font-bold text-yellow-400">
            UNIVERSITY OF CEBU
          </CardTitle>
          <CardTitle class="text-2xl sm:text-3xl font-semibold text-blue-400 mt-2">
            COLLEGE OF INFORMATION AND COMPUTER STUDIES
          </CardTitle>
          <CardDescription class="text-xl text-white mt-4">
            LABORATORY RULES AND REGULATIONS
          </CardDescription>
        </CardHeader>

        <CardContent class="mt-6">
          <Alert class="mb-8 border-blue-500 bg-blue-500/10">
            <Info class="h-5 w-5 text-blue-400" />
            <AlertTitle class="text-blue-300">Important Notice</AlertTitle>
            <AlertDescription class="text-gray-300">
              To avoid embarrassment and maintain camaraderie with your friends and superiors at our laboratories, please observe the following:
            </AlertDescription>
          </Alert>

          <ScrollArea class="h-[50vh] pr-4">
            <div class="space-y-6">
              <div v-for="(rule, index) in rules" :key="index" class="group">
                <div class="flex items-start gap-4">
                  <Badge variant="outline" class="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-700 group-hover:bg-gray-600 transition-colors">
                    {{ index + 1 }}
                  </Badge>
                  <p class="text-gray-300 leading-relaxed">
                    {{ rule.text }}
                    <ul v-if="rule.subItems" class="mt-2 space-y-2 pl-6 list-disc text-gray-400">
                      <li v-for="(subItem, subIndex) in rule.subItems" :key="subIndex">
                        {{ subItem }}
                      </li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, FileText } from 'lucide-vue-next'

const rules = [
  {
    text: 'Maintain silence, proper decorum, and discipline inside the laboratory. Mobile phones, walkmans and other personal pieces of equipment must be switched off.'
  },
  {
    text: 'Games are not allowed inside the lab. This includes computer-related games, card games and other games that may disturb the operation of the lab.'
  },
  {
    text: 'Surfing the Internet is allowed only with the permission of the instructor. Downloading and installing of software are strictly prohibited.'
  },
  {
    text: 'Getting access to other websites not related to the course (especially pornographic and illicit sites) is strictly prohibited.'
  },
  {
    text: 'Deleting computer files and changing the set-up of the computer is a major offense.'
  },
  {
    text: 'Observe computer time usage carefully. A fifteen-minute allowance is given for each use. Otherwise, the unit will be given to those who wish to "sit-in".'
  },
  {
    text: 'Observe proper decorum while inside the laboratory.',
    subItems: [
      'Do not get inside the lab unless the instructor is present.',
      'All bags, knapsacks, and the likes must be deposited at the counter.',
      'Follow the seating arrangement of your instructor.',
      'At the end of class, all software programs must be closed.',
      'Return all chairs to their proper places after using.'
    ]
  },
  {
    text: 'Chewing gum, eating, drinking, smoking, and other forms of vandalism are prohibited inside the lab.'
  },
  {
    text: 'Anyone causing a continual disturbance will be asked to leave the lab. Acts or gestures offensive to the members of the community, including public display of physical intimacy, are not tolerated.'
  },
  {
    text: 'Persons exhibiting hostile or threatening behavior such as yelling, swearing, or disregarding requests made by lab personnel will be asked to leave the lab.'
  },
  {
    text: 'For serious offense, the lab personnel may call the Civil Security Office (CSU) for assistance.'
  },
  {
    text: 'Any technical problem or difficulty must be addressed to the laboratory supervisor, student assistant or instructor immediately.'
  }
]
</script>