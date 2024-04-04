<script setup>
import { useUiStore } from '@/stores/ui.js';
import { useAppControllerStore  } from '@/stores/appController';

const uiStore = useUiStore();
const appControllerStore = useAppControllerStore();

</script>

<template>
  <div
    class="box-1 q-ma-xs"
    :style="{'height': uiStore.heightPanel + 'px'}"
  >
    <div class="row q-mt-xl q-ma-sm">
      <div class="col-6">
        <span
          class="text-h5"
        >speed of typing: {{ appControllerStore.wordsPerMinute.toFixed(0) }}
        </span>
        <span class="wpm-container">
          <span class="wpm-content">WpM</span>
        </span>
      </div>
      <div class="col-6">
        <span
          class="text-h5"
        >accuracy: {{ appControllerStore.accuracyInPercent.toFixed(2) }} %
        </span>
      </div>
    </div>
    <div class="row q-mt-md q-ma-sm">
      <div class="col">
        Debug: current block: {{ appControllerStore.currentPositionBlock }}  / current char position: {{ appControllerStore.currentPositionChar }}
      </div>
    </div>
  </div>
</template>