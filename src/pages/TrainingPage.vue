<script setup>
import { watch } from 'vue';

import { storeToRefs } from 'pinia';

import { useQuasar } from 'quasar';

import { useAppStateStore  } from '@/stores/appState';
import { useAppControllerStore  } from '@/stores/appController';

import ControlPanel from '@components/ControlPanel.vue';
import StatePanel from '@components/StatePanel.vue';
import TypingProgressField from '@components/TypingProgressField.vue';

const $q = useQuasar();

const appStateStoreRefs =  storeToRefs(useAppStateStore());
const appControllerStore = useAppControllerStore();


watch(appStateStoreRefs.isTypingFinished, (newValue, oldValue) => {
  if(oldValue === false && newValue === true) {
    
    const dialogMessage = `
      <span class="text-h6">You have finished the typing with an accuracy of <span class="text-red"> ${appControllerStore.accuracyInPercent.toFixed(0)}% </span> </span>
      <span
          class="text-h6"
        >at a speed of: ${appControllerStore.wordsPerMinute.toFixed(0)}
        </span>
        <span class="wpm-container">
          <span class="wpm-content">WpM</span>
        </span>
    `;

    $q.dialog({
        title: '<span class="text-h4">Typing finished!</span>',
        message: dialogMessage,
        html: true,
        ok: {
          push: true,
          color: 'primary'
        },
      }).onDismiss(() => {
        appControllerStore.resetProgress();
      });
  }
  
});

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
      <TypingProgressField
        :typing-finished="appStateStoreRefs.isTypingFinished.value"
      />
    </div>
  </div>
</template>