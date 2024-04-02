<script setup>

import { ref, computed, onMounted, onUpdated } from 'vue';

import { useUiStore } from '@/stores/ui.js';
import { useAppControllerStore  } from '@/stores/appController';
import { useTypingContentStore  } from '@/stores/typingContent';

const uiStore = useUiStore();
const appControllerStore = useAppControllerStore();
const typingContentStore =  useTypingContentStore();

const typingContainerElement = ref(null);
const currentTypingPositionDivRefs = ref(null);

onMounted(() => {
  typingContainerElement.value = document.getElementById("typing-container");;
});

onUpdated(() => {
  console.log('update component'); //TODO: remove later;
  
});

</script>

<template>
  <div
    id="typing-container"
    class="box-1 q-ma-xs q-pa-xs"
    style="overflow-x: hidden; overflow-y: auto;"
    :style="{'min-height': uiStore.heightTypingField + 'px', 'height': uiStore.heightTypingField + 'px'}"
  >
    <div class="content-container">
      <div
        v-for="(block, ix_block) in typingContentStore.contentData"
        :key="ix_block"
        :class="{'line-break-div': block.type === 'lf', 'block-div': block.type !== 'lf', 'char-content-space': block.type === 'space'}"
      >
        <div
          v-if="block.type !== 'lf'"
        >
          <div
            v-for="(char, ix_char) in block.chars"
            :key="ix_char"
            class="char-div font-serif"
            :class="{
              'char-current': ix_block === appControllerStore.currentPositionBlock && ix_char === appControllerStore.currentPositionChar,
              'char-good': char.failed === false,
              'char-bad': char.failed === true,
            }"
          >
            {{ char.char }}
            <div
              v-if="char.failed === true"
              class="char-failure-div font-arial"
            >
              {{ char.failedChar }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.content-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.block-div {
  margin: 0.45rem 0.00rem;
  height: 2rem;
  //padding: 0.05rem;
  user-select: none;
}

.char-div {
  position: relative;
  display: inline;
	font-size: 1.8rem;
  text-align: center;
  letter-spacing: .15rem;
}

.char-current {
  position: relative;
  z-index : 1;
}

.char-current:before {
  content : "";
  position: absolute;
  left    : 0;
  bottom  : 0;
  width   : 1rem;
  border-bottom:0.15rem solid #404040;
}

.char-content-space {
    color: #00000020;
}

.char-good {
  background-color: $positive;
  opacity: 0.4;
}

.char-bad {
 background-color: $negative;
}

.char-failure-div {
  position: absolute;
  padding: 0 0.2rem;
  font-size: 0.8rem;
  color: $negative;
  background-color: $warning;
  top: -9px;
  right: 0px;
  opacity: 0.7;
  min-width: 0.8rem;
  min-height: 0.8rem;
  max-height: 1rem;
}

.line-break-div {
    flex-basis: 100%;
    height: 0;
}

</style>
