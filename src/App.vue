<script setup>

import { ref, computed, onMounted, onBeforeMount } from 'vue';

import { useTypingContentStore  } from '@/stores/typingContent';

const  typingContentStore =  useTypingContentStore();

onMounted(() => {
  typingContentStore.loadDemoContent('demotext.txt');
  //typingContentStore.loadDemoContent('vite.svg');
  //typingContentStore.loadDemoContent('bintest.txt');
});



</script>

<template>
  <!-- <router-view /> -->
  <div class="row">
    <div class="col">
      ... Header ...
    </div>
    <div class="col">
      .. Control..
    </div>
    <div class="col">
      ..{{ typingContentStore.foo }}
    </div>
  </div>
  <div class="row">
    <div class="col">
      <span
        v-for="(data, ix) in typingContentStore.data"
        :key="ix"
      >
        {{ data.char }}
      </span>
    </div>
  </div>
</template>
