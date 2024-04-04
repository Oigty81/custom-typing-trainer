<script setup>
import { ref, watch, onMounted, onUpdated } from 'vue';

import { useUiStore } from '@/stores/ui.js';
import { useAppControllerStore  } from '@/stores/appController';
import { useTypingContentStore  } from '@/stores/typingContent';

const uiStore = useUiStore();
const appControllerStore = useAppControllerStore();
const typingContentStore =  useTypingContentStore();

const props = defineProps({
  typingFinished: { type: Boolean, required: true, default: () => {
            return false;
        }
    },
});

const typingContainerElement = ref(null);

onMounted(() => {
  typingContainerElement.value = document.getElementById("typing-container");;
});

onUpdated(() => {
  scrollToCurrentTypingPosition();
});

watch(appControllerStore, () => {
  if(appControllerStore.currentPositionBlock === 0) {
    typingContainerElement.value.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
  }
});

const scrollToCurrentTypingPosition = () => {
  let tc = typingContainerElement.value;
  let charCurrent = document.getElementsByClassName("char-current")[0];

  const charLineDistanceFromBorder = 35;

  if(charCurrent !== undefined) {
    let rectContainer = tc.getBoundingClientRect();
    let rectCharCurrent = charCurrent.getBoundingClientRect();
    let containerBottom = rectContainer.top + tc.offsetHeight;

    if(rectCharCurrent.top + charLineDistanceFromBorder + tc.scrollTop > containerBottom) {
      let computedScrollToBottom = rectCharCurrent.top + tc.scrollTop + charLineDistanceFromBorder - containerBottom;
      
      tc.scrollTo({
          top: computedScrollToBottom,
          left: 0,
          behavior: "smooth",
        });
    }
  }
};

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
              'char-current': ix_block === appControllerStore.currentPositionBlock && ix_char === appControllerStore.currentPositionChar && !props.typingFinished,
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
  z-index: 999;
}

.line-break-div {
    flex-basis: 100%;
    height: 0;
}
</style>
