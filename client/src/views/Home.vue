<template>
  <div class="home-container">
    <h1 v-if="framework">{{ framework.name }} Documentation</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="framework">

      <section v-if="!topic && !activeSubtopic" class="content-section">
        <h2>{{ framework.name }} Overview</h2>
        <p>{{ framework.description || 'No description available.' }}</p>
      </section>


      <div v-if="topic">
        <h2>{{ topic.title }}</h2>
        <p>{{ topic.description || 'No description available.' }}</p>
        <div v-for="subtopic in topic.subtopics" :key="subtopic.name" :id="sanitizeId(subtopic.name)">
          <section class="content-section">
            <h3>{{ subtopic.name }}</h3>
            <p>{{ subtopic.content.description }}</p>
            <pre v-if="subtopic.content.code"><code>{{ subtopic.content.code }}</code></pre>
          </section>
        </div>
      </div>
    </div>
    <div v-else>
      <h2>Welcome to IThubr</h2>
      <p>Select a framework from the sidebar to get started.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApiStore } from '../store/apiTopics'
import { storeToRefs } from 'pinia'

const route = useRoute()
const apiStore = useApiStore()
const { frameworks, loading, error } = storeToRefs(apiStore)


const sanitizeId = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-') 
    .trim()
}

const framework = computed(() => {
  const fw = frameworks.value.find(f => f.id === route.params.frameworkId)
  console.log('Framework:', fw, 'Route params:', route.params)
  return fw
})

const topic = computed(() => {
  if (!framework.value || !route.params.topicId) return null
  const tp = framework.value.topics.find(t => t.id === route.params.topicId)
  console.log('Topic:', tp, 'Route params:', route.params)
  return tp
})

const activeSubtopic = computed(() => decodeURIComponent(route.params.subtopicName || ''))

onMounted(() => {
  if (!frameworks.value.length) {
    apiStore.fetchFrameworks()
  }
  // Scroll to subtopic if specified in the URL
  if (route.hash) {
    setTimeout(() => {
      const sanitizedHash = sanitizeId(decodeURIComponent(route.hash.replace('#', '')))
      console.log('Attempting to scroll to:', `#${sanitizedHash}`)
      const element = document.querySelector(`#${sanitizedHash}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        console.warn(`Element with ID #${sanitizedHash} not found`)
      }
    }, 500)
  }
})
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  background-color: #1b1b1f;
  color: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
}

.content-section {
  margin-bottom: 2rem;
}

.content-image {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
}

pre {
  background: #252529;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  color: #f8f8f2;
  margin: 1rem 0;
  border: 1px solid #3a3a3f;
  font-size: 0.9rem;
}

code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  color: #f8f8f2;
  font-size: 0.9rem;
}

.loading {
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.error {
  padding: 1rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  font-size: 0.95rem;
  margin: 0.75rem 0;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: white;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #3a3a3f;
}

h2 {
  font-size: 1.375rem;
  font-weight: 600;
  color: white;
  margin: 2rem 0 1rem;
  padding-top: 0.25rem;
}

h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 1.5rem 0 0.75rem;
}

p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

/* Welcome message */
.home-container > div:last-child h2 {
  font-size: 1.5rem;
  margin: 1.5rem 0 0.75rem;
}

.home-container > div:last-child p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}
</style>