<template>
  <div class="header_content__sectorIT">
    
    <Navigation />
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

export default {
  components: {
    Navigation
  }
};
</script>

<style scoped>
.header_content__sectorIT {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #2e2e32;
  height: 60px;
  position: fixed;
  width: 100%;
  background: #1b1b1f;
}
h1 {
  color: red;
}
</style>