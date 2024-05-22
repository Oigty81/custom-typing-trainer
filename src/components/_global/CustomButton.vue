<script setup>

const emit = defineEmits(['click']);

const onClick = () => {
    emit('click');
};

</script>

<template>
  <q-btn
    no-caps
    class="q-btn-1"
    size="sm"
    style="width: 100%;"
    @click="onClick"
  >
    <slot />
  </q-btn>
</template>