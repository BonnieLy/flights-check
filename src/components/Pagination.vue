<template>
  <div class="pagination-container">
    <div class="pagination-box">
      <button :disabled="page === 1" @click="updatePage(1)">First</button>
      <button :disabled="page === 1" @click="updatePage(page - 1)">Prev</button>
    </div>

    <div class="pagination-box">
      <button :class="{ isActive: p + i === page }" v-for="(p, i) in pages" @click="updatePage(p + i)">
        {{ p + i }}
      </button>
    </div>

    <div class="pagination-box">
      <button :disabled="page === lastPage" @click="updatePage(page + 1)">Next</button>
      <button :disabled="page === lastPage" @click="updatePage(lastPage)">Last</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  showMax: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(['update:page']);

const pages = computed(() => {
  // the far left number should be = page number - 1 or = 1
  const min = Math.max(props.page - 1, 1);

  // the far left number should not be the same as the (showMax - 1) last one
  // for example, there are 6 pages in total, current page is 6, it should show 4 5 6
  // => far left is 4, instead of 6 - 1 = 5
  const max = Math.max(props.lastPage - props.showMax + 1, 1);

  return Array(Math.min(props.showMax, props.lastPage)).fill(Math.min(min, max));
});

/**
 * 
 * @param {number} page 
 */
function updatePage(page) {
  if (page < 1 || page > props.lastPage || page === props.page) {
    return;
  }

  emit('update:page', page);
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixins';

.pagination-container {
  display: flex;
  gap: 1em;

  @include breakpoint-tablet {
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
  }
}

.pagination-box {
  display: flex;
  gap: 1em;

  @include breakpoint-tablet {
    gap: 0.5em;
  }
}
</style>