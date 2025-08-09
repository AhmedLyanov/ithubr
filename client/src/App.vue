<template>
  <main class="layout">
    <Sidebar v-if="!route.meta.hideSidebar"/>
    <div class="main-content">
       <Header />
      <RouterView />
    </div>
  </main>

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
import Header from './components/Header.vue';

const route = useRoute()
</script>
