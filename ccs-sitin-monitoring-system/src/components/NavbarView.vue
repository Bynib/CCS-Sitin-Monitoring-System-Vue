<template>
  <div class="flex justify-between absolute w-screen p-5 bg-[#2e2e2e]">
    <div class="flex justify-between w-screen">
      <img
        src="@/assets/CCS_LOGO.png"
        alt="CCS"
        width="80"
        class="cursor-pointer"
        onclick="window.location.href = '/dashboard'"
      />
      <div class="flex items-center gap-5 pr-2">
        <button class="normalButton">Profile</button>
        <button class="normalButton">Announcement</button>
        <button class="normalButton">Sit-in Rules</button>
        <button class="normalButton">Lab Rules and Regulation</button>
        <button class="normalButton">Sitin History</button>
        <button class="normalButton">Reservation</button>
        <button class="normalButton">View Remaining Session</button>
        <button
          class="font-bold text-white bg-red-500 hover:bg-red-600 rounded p-2 transition-colors duration-400"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
<!-- onclick="window.location.href = '/login'" -->
<!-- onclick="window.location.href='/register'" -->
