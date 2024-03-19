<script setup>
import { useUiStore } from '@/stores/ui.js';
import { useAppControllerStore  } from '@/stores/appController';
import { useTypingContentStore  } from '@/stores/typingContent';

const uiStore = useUiStore();
const appControllerStore = useAppControllerStore();
const typingContentStore =  useTypingContentStore();

</script>

<template>
  <div
    class="box-1 q-ma-xs"
    :style="{'height': uiStore.heightPanel + 'px'}"
  >
    <div class="row">
      <div class="col-6">
        .. {{ appControllerStore.currentPositionBlock }} // {{ appControllerStore.currentPositionChar }}
      </div>
      <div class="col-6">
        ..
      </div>
    </div>
  </div>
</template>