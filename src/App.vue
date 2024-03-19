<script setup>
import { useUiStore } from '@/stores/ui.js';

const uiStore = useUiStore();

uiStore.heightViewport = window.innerHeight;

addEventListener("resize", () => {
  uiStore.heightViewport = window.innerHeight;
});
</script>

<template>
  <router-view />
</template>

