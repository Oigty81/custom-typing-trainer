<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import { useUiStore } from '@/stores/ui.js';
import { useAppStateStore } from '@/stores/appState';
import { useAppControllerStore } from '@/stores/appController';
import { useTypingContentStore  } from '@/stores/typingContent';

const $q = useQuasar();

const uiStore = useUiStore();
const appStateStore =  useAppStateStore();
const appControllerStore =  useAppControllerStore();
const typingContentStore =  useTypingContentStore();

const fileToUpload = ref(null);

const resetProgress = () => {
  blurActiveElement();
  appControllerStore.resetProgress();
};

const clearContent = () => {
  blurActiveElement();
  appControllerStore.resetProgress(true);
};

const loadDemoFile = (filename) => {
  ////blurActiveElement(); //TODO remove redundant method call
  fileToUpload.value = null;
  appStateStore.typingProgressEnabled = false;
  typingContentStore.loadDemoContent(filename)
  .then(() => {
    resetProgress();
    appStateStore.typingProgressEnabled = true;
  })
  .catch((err) => {
    $q.notify({
      progress: true,
      message: "no valid text file!",
      color: 'negative',
      position: 'top'
    });
    console.log('was error: ', err.error);
  });
};

watch(fileToUpload, () => {
    if(fileToUpload.value != null) {
      typingContentStore.loadContentFromCustomFile(fileToUpload.value)
      .then(() => {
        resetProgress();
        appStateStore.typingProgressEnabled = true;
      })
      .catch(() => {
        appStateStore.typingProgressEnabled = true;
        fileToUpload.value = null;
        $q.notify({
              progress: true,
              message: "no valid text file!",
              color: 'negative',
              position: 'top'
            });
      });
    } else {
      clearContent();
    }
  }, {deep: false, immediate: false }
);


const blurActiveElement = () => {
  document.activeElement.blur(); //TODO: find better solution
};

</script>

<template>
  <div
    class="box-1 q-ma-xs"
    :style="{'height': uiStore.heightPanel + 'px'}"
  >
    <div class="row q-mt-lg">
      <div class="col-3">
        <div class="row">
          <div class="col-12 q-px-sm">
            <q-btn
              no-caps
              class="q-btn-1"
              size="sm"
              style="width: 100%;"
              @click="resetProgress()"
            >
              Reset Progress
            </q-btn>
          </div>
          <div class="col-12 q-px-sm q-pt-sm">
            <q-btn
              no-caps
              class="q-btn-1"
              size="sm"
              style="width: 100%;"
              @click="clearContent()"
            >
              Clear Content
            </q-btn>
          </div>
        </div>
      </div>
      
      <div class="col-3 offset-3 q-px-sm">
        <q-btn
          no-caps
          class="q-btn-1"
          size="sm"
          style="width: 100%;"
          @click="loadDemoFile('demotext1.txt')"
        >
          Load Demo 1
        </q-btn>
      </div>
      <div class="col-3 q-px-sm">
        <q-btn
          no-caps
          class="q-btn-1"
          size="sm"
          style="width: 100%;"
          @click="loadDemoFile('demotext2.txt')"
        >
          Load Demo 2
        </q-btn>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-6">
        <div class="row">
          <div class="col-12">
            <q-checkbox
              v-model="appStateStore.ignoreCapitalizeEnabled"
              class="q-checkbox-1"
              label="ignore capitalize"
              @click="blurActiveElement"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-checkbox
              v-model="appStateStore.keySoundEnabled"
              class="q-checkbox-1"
              label="keysound enabled"
              @click="blurActiveElement"
            />
          </div>
        </div>
      </div>
      <div class="col-6 q-pa-xs">
        <q-file
          v-model="fileToUpload"
          clearable
          class="q-filepicker-1"
          filled
          label="choose txt-file for training"
          accept=".txt"
        >
          <template #prepend>
            <q-icon
              v-if="fileToUpload === null || fileToUpload === undefined"
              name="attach_file"
            />
            <span
              v-if="fileToUpload === null || fileToUpload === undefined"
              class="text-subtitle2"
              @click.stop
            />
          </template>
        </q-file>
      </div>
    </div>
  </div>
</template>