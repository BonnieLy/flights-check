<template>
  <div class="loading-container">
    <div class="loading-content">
      <h1 class="loading-text">Loading...</h1>
      <img src="@assets/loading.gif" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/_variables";

.loading-container {
  height: 100%;
  width: 100%;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;

  >.loading-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    >.loading-text {
      color: $color-main;
    }
  }
}
</style>