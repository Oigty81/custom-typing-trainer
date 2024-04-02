<script setup>
import HeaderBar from '@components/HeaderBar.vue';
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <HeaderBar />
    <q-page-container
      id="main-content-el"
      style="overflow-x: hidden; overflow-y: hidden;"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>