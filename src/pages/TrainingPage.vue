<script setup>
import ControlPanel from '@components/ControlPanel.vue';
import StatePanel from '@components/StatePanel.vue';
import TypingProgressField from '@components/TypingProgressField.vue';
</script>

<template>
  <div class="row q-mt-xs">
    <div class="col-md-6 col-12">
      <ControlPanel />
    </div>
    <div class="col-md-6 col-12">
      <StatePanel />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <TypingProgressField />
    </div>
  </div>
</template>