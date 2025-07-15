<template>
  <div class="layout">
    <Sidebar v-if="!route.meta.hideSidebar"/>
    <main class="main-content">
      <RouterView />
    </main>
  </div>

</template>

<style scoped>
.layout{
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: var(--main-background-color);
}
</style>

<script setup>
import Sidebar from './components/Sidebar.vue';
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
