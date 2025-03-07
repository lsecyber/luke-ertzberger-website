<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import {ref} from "vue";

const navigation = ref([
    { name: 'Home', href: '/'},
    /*{ name: 'About', href: '/#about'},*/
    /*{ name: 'Skills', href: '/#skills'},*/
    { name: 'Projects', href: '/#projects'},
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/lukeertzberger/'},
    { name: 'GitHub', href: 'https://github.com/lsecyber'},
    { name: 'Resume', href: 'https://lukeertzberger.com/Luke%20Ertzberger%20Resume.pdf'}
])

const ctaButton = ref({
    name: 'Contact Me',
    href: '/contact'
})
</script>

<template>
  <html class="bg-gray-800 min-h-[100vh]">
  <header class="sticky top-0 z-50">
    <!-- Navbar -->
    <!--<nav class="p-5 bg-gray-800 shadow-md text-white m:d-none">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold font-heading">Luke Ertzberger</h1>
        <ul class="flex space-x-6">
          <li><a href="#about" class="hover:text-cyan-400">About</a></li>
          <li><a href="#skills" class="hover:text-cyan-400">Skills</a></li>
          <li><a href="#projects" class="hover:text-cyan-400">Projects</a></li>
          <li><a href="#contact" class="hover:text-cyan-400">Contact</a></li>
        </ul>
      </div>
    </nav>-->
    <NavBar :navigation="navigation" :cta-button="ctaButton"/>
  </header>
  <body>
  <RouterView />
  </body>
  <footer class="text-center py-6 bg-gray-800" v-fade-in>
    <p class="text-gray-400">&copy; 2025 Luke Ertzberger. All rights reserved. <a href="https://github.com/lsecyber/luke-ertzberger-website" target="_blank"><u>Source Code</u></a></p>
  </footer>
  </html>

</template>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
