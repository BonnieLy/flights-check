<template>
  <div class="search-box-container">
    <div class="select-container" v-if="type === 'select'">
      <p>{{ label }}</p>

      <div>
        <select :value="query" @input="updateQuery">
          <option disabled value="">Please select one</option>
          <option v-for="option of options" :key="option">{{ option }}</option>
        </select>

        <img src="@assets/cross_circle.svg" @click="emit('update:query', '')" />
      </div>
    </div>

    <div class="input-container" v-else>
      <p>{{ label }}</p>

      <div>
        <input type="text" @input="updateQuery" :value="query" :placeholder="placeholder">
        <img src="@assets/cross_circle.svg" @click="emit('update:query', '')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { debouncer } from '@stores/Flight';

const props = defineProps({
  label: {
    type: String,
  },
  options: {
    type: Array,
  },
  type: {
    type: String,
  },
  query: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Search for ...',
  },
});

const emit = defineEmits(['update:query']);

function updateQuery($e) {
  debouncer(() => emit('update:query', $e.target.value));
}
</script>

<style lang="scss" scoped>
.search-box-container {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
}

p {
  margin: 0 0 1em 0;
}

.input-container {
  width: 100%;

  >div {
    position: relative;

    >input {
      width: calc(100% - 2em); // 2em for padding left and right
      outline: none;
      padding: 1em;
      border-radius: 3px;
      border: 1px solid black;
    }

    >img {
      width: 1em;
      position: absolute;
      top: calc((100% - 1em) / 2); // calc the middle position, 1em for padding top and bottom
      right: 0.5em;
      cursor: pointer;
    }
  }
}

.select-container {
  width: 100%;

  >div {
    position: relative;

    >img {
      width: 1em;
      position: absolute;
      top: calc((100% - 1em) / 2); // calc the middle position, 1em for padding top and bottom
      right: 0.5em;
      cursor: pointer;
    }
  }
}
</style>