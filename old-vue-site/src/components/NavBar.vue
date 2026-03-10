<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {Bars3Icon, XMarkIcon} from '@heroicons/vue/24/outline'
import {computed, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const props = defineProps({
  navigation: {
    type: Array,
    required: true
  },
  ctaButton: {
    type: Object,
    default: () => {return {name: undefined, href: undefined}},
    validator(value, props) {
      if (Object.keys(value).length > 0) {
        return Object.keys(value).includes('name') && Object.keys(value).includes('href')
      } else {
        return true
      }
    }
  }
})

const currentPath = ref(window.location.pathname + window.location.hash);

watchEffect(() => {
  const path = route.path
  const hash = route.hash
  currentPath.value = path + hash;
});

const usableNavigation = computed(() => {
  return props.navigation.map(item => {
    return {
      ...item,
      current: item.href === currentPath.value,
      externalLink: item.href.startsWith('http')
    }
  })
});

const hasCtaButton = computed(() => {
  return Object.keys(props.ctaButton).length > 0
})
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800 shadow-md" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">

          <div class="inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>

          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex shrink-0 items-center">
              <a href="/">
                <object class="h-14 w-auto rounded-full pr-[40px]" data="/logos/main-no-background-svg.svg" type="image/svg+xml">
                  <img class="h-14 w-auto rounded-full" src="/logos/main-no-background.webp" alt="Small box with <LE> in the middle" />
                </object>
              </a>

              <!--<img class="h-14 w-auto rounded-full" src="/luke-headshot-styled.png" alt="Headshot of Luke E" />-->
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <a
                    v-for="item in usableNavigation"
                    :key="item.name"
                    :href="item.href"
                    :target="item.externalLink ? '_blank' : undefined"
                    :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-5 text-sm font-medium font-heading']"
                    :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</a>

              </div>
            </div>
          </div>

          <template v-if="hasCtaButton">
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:block">
              <DisclosureButton class="bg-cyan-300 hover:bg-cyan-400 text-black block rounded-md px-3 py-2 text-base font-medium font-heading" as="a" :href="props.ctaButton?.href">{{props.ctaButton?.name}}</DisclosureButton>
            </div>
          </template>

          <!--<div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <DisclosureButton class="bg-cyan-300 hover:bg-cyan-400 text-black block rounded-md px-3 py-2 text-base font-medium font-heading">Contact Me</DisclosureButton>
            !-- Profile dropdown --
            !--<Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <img class="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                  <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Profile</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign out</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>--
          </div>-->

        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3">
          <DisclosureButton
              v-for="item in usableNavigation"
              :key="item.name"
              as="a"
              :href="item.href"
              :target="item.externalLink ? '_blank' : undefined"
              :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton>
          <DisclosureButton
              as="a"
              :href="props.ctaButton.href"
              :target="props.ctaButton.href.startsWith('http') ? '_blank' : undefined"
              :class="[
                  props.ctaButton.href === currentPath
                      ? 'bg-gray-900 text-white'
                      : 'bg-cyan-300 text-white hover:bg-cyan-400 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium'
              ]"
              :aria-current="props.ctaButton.href === currentPath ? 'page' : undefined"
          >
            {{ props.ctaButton.name }}
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
</template>

<style scoped>

</style>