<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
    CodeBracketIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CommandLineIcon,
    CodeBracketSquareIcon,
    LightBulbIcon,
    ArrowsRightLeftIcon,
    ChatBubbleLeftRightIcon,
    BoltIcon,
    WindowIcon,
    CircleStackIcon,
    ServerIcon,
    ServerStackIcon,
    CubeIcon,
    ComputerDesktopIcon
} from '@heroicons/vue/24/outline'
import IconAngularLogo from "@/components/icons/IconAngularLogo.vue";
import IconVueLogo from "@/components/icons/IconVueLogo.vue";
import IconReactLogo from "@/components/icons/IconReactLogo.vue";
import IconNodeJs from "@/components/icons/IconNodeJs.vue";
import IconPython from "@/components/icons/IconPython.vue";
import IconAWSLogo from "@/components/icons/IconAWSLogo.vue";
import IconGit from "@/components/icons/IconGit.vue";
import IconSquarespaceLogo from "@/components/icons/IconSquarespaceLogo.vue";
import IconAdobeLogo from "@/components/icons/IconAdobeLogo.vue";

import {useVModel} from '@vueuse/core'


const iconMap = {
  'exclamation-triangle': ExclamationTriangleIcon,
  'information-circle': InformationCircleIcon,
  'code-bracket': CodeBracketIcon,
  'command-line': CommandLineIcon,
  'code-bracket-square': CodeBracketSquareIcon,
  'light-bulb': LightBulbIcon,
  'arrows-right-left': ArrowsRightLeftIcon,
  'chat-bubble-left-right': ChatBubbleLeftRightIcon,
  'bolt': BoltIcon,
  'window': WindowIcon,
  'circle-stack': CircleStackIcon,
  'server': ServerIcon,
  'server-stack': ServerStackIcon,
  'cube': CubeIcon,
  'computer-desktop': ComputerDesktopIcon,
  'angular-logo': IconAngularLogo,
  'vue-logo': IconVueLogo,
  'react-logo': IconReactLogo,
  'node-js': IconNodeJs,
  'python': IconPython,
  'aws-logo': IconAWSLogo,
  'git': IconGit,
  'squarespace-logo': IconSquarespaceLogo,
  'adobe-logo': IconAdobeLogo
};

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'chat-bubble-left-right'
  },
  iconColorClass: {
    type: String,
    default: 'text-red-600'
  },
  title: {
    type: String,
    default: 'Alert!'
  },
  message: {
    type: String,
    required: true
  },
})
const emit = defineEmits(['update:open'])
const open = useVModel(props, 'open', emit)

</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-100 sm:mx-0 sm:size-10">
                    <component
                        :is="iconMap[props.icon]"
                        v-if="props.icon && iconMap[props.icon]"
                        :class="'size-6' + props.iconColorClass"
                        aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900">{{props.title}}</DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">{{props.message}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="open = false" ref="cancelButtonRef">Close</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>