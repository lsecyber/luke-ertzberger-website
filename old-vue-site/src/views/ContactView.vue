<script setup>


import {ref} from "vue";

const googleFormUrl = ref('https://docs.google.com/forms/d/e/1FAIpQLScNT8_kpmdYuPmR03yXuMDy74DDOixrBqvNyHyU3zQJNxRcUQ/viewform?usp=header')
</script>

<template>
  <main class="bg-gray-900 text-white">

    <!-- Hero Section -->
    <section class="text-center py-20">
      <h2 class="text-4xl font-bold font-heading" v-fade-in>Contact Me</h2>
      <p class="text-gray-400 mt-4" v-fade-in>Ask a question, discuss a potential project, or just say hi!</p>
      <p class="text-grey-400 text-center w-full text-2xl mx-auto max-w-250 mt-4" v-fade-in>
        Please fill out the form below and I'll get back to you as soon as possible. Thanks for stopping by and reaching out!
      </p>

    </section>

    <!-- About Section -->
    <section id="contact-form" class="py-20 bg-gray-800">
      <div class="container mx-auto flex justify-center" v-fade-in-immediately>
        <iframe class="w-full h-350 rounded-xl max-w-170" :src="googleFormUrl" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>