<template>
  <div v-if="isLoading">
    <Loading />
  </div>
  <div v-else class="app-container">
    <Header />
    <Flight />
  </div>
</template>

<script setup>
import Header from '@/components/Header';
import Flight from '@/pages/Flight';
import Loading from '@/pages/Loading';
import { isLoading } from '@/stores/Flight';
</script>

<style lang="scss">
@import '@/styles/_variables';
@import 'sweetalert2/src/sweetalert2.scss';

html,
body,
#app {
  height: 100%;
  overflow: hidden;
  margin: 0;
  font-family: 'AR One Sans', sans-serif;

  h1,
  h2,
  h3 {
    font-family: 'Young Serif', serif;
  }
}

.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

button {
  font-family: 'AR One Sans', sans-serif;
  border-radius: 1em;
  outline: none;
  background-color: $color-dark;
  color: white;
  border: 1px solid $color-dark;
  padding: 0.5em 1em;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.isActive {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &:hover {
    color: $color-dark;
    background-color: white;
  }
}

select {
  width: 100%;
  border: 1px solid black;
  border-radius: 3px;
  padding: 1em 1em;
  font-family: 'AR One Sans', sans-serif;
  -webkit-appearance: none; // to deal with iOS
  color: black;
  background-color: white;
}

.icon-header {
  vertical-align: sub;
  margin-right: 0.5em;
}

.icon-sort {
  width: 1.5em;
  vertical-align: middle;

  &.isReversed {
    transform: rotate(180deg);
  }
}

.bold {
  font-weight: bold;
}

::-webkit-scrollbar {
  height: 1px;
  width: 3px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
</style>