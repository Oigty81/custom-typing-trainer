<script setup>
import { useUiStore } from '@/stores/ui.js';

import HeaderBar from '@components/HeaderBar.vue';

const uiStore = useUiStore();

</script>

<template>
  <q-layout view="hHh lpR fFf">
    <HeaderBar />
    <q-page-container
      id="main-content-el"
      style="overflow-x: hidden; overflow-y: hidden;"
      :style="{'max-height': uiStore.getHeightContent + 'px'}"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>