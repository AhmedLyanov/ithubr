<template>
  <div class="home-container">
    <h1 v-if="framework">{{ framework.name }} Documentation</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="framework">
      <section v-if="!topic && !activeSubtopic" class="content-section">
        <h2>{{ framework.name }} Overview</h2>
        <p>{{ framework.description || "No description available." }}</p>
      </section>

      <div class="main_content__theme">
        <div v-if="topic">
          <h2>{{ topic.title }}</h2>
          <p>{{ topic.description || "No description available." }}</p>
          <div
            v-for="subtopic in topic.subtopics"
            :key="subtopic.name"
            :id="sanitizeId(subtopic.name)"
          >
            <section class="content-section">
              <h3>{{ subtopic.name }}</h3>
              <pre
                v-if="subtopic.content.code"
              ><code>{{ subtopic.content.code }}</code></pre>
            </section>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="welcome-container">
      <div class="welcome-content">
        <div class="logo-container">
          <div class="logo-circle">
            <img
              src="../assets/CMD-S_notext.svg"
              alt="CMD-S Logo"
              class="welcome-logo"
            />
          </div>
        </div>
        <h2>WELCOME TO <span class="cmd-text">CMD-S</span></h2>
        <p class="welcome-subtitle">CREATE · MONITOR · DEPLOY</p>
        <p class="welcome-description">
          Your comprehensive platform for seamless development and infrastructure management.
          Select a framework from the sidebar to explore its documentation.
        </p>
        <div class="tech-grid">
          <div class="tech-item">DEVOPS</div>
          <div class="tech-item">CLOUD</div>
          <div class="tech-item">CI/CD</div>
          <div class="tech-item">AUTOMATION</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApiStore } from "../store/apiTopics";
import { storeToRefs } from "pinia";

const route = useRoute();
const apiStore = useApiStore();
const { frameworks, loading, error } = storeToRefs(apiStore);

const sanitizeId = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};

const framework = computed(() => {
  const fw = frameworks.value.find((f) => f.id === route.params.frameworkId);
  console.log("Framework:", fw, "Route params:", route.params);
  return fw;
});

const topic = computed(() => {
  if (!framework.value || !route.params.topicId) return null;
  const tp = framework.value.topics.find((t) => t.id === route.params.topicId);
  console.log("Topic:", tp, "Route params:", route.params);
  return tp;
});

const activeSubtopic = computed(() =>
  decodeURIComponent(route.params.subtopicName || "")
);

onMounted(() => {
  if (!frameworks.value.length) {
    apiStore.fetchFrameworks();
  }

  if (route.hash) {
    setTimeout(() => {
      const sanitizedHash = sanitizeId(
        decodeURIComponent(route.hash.replace("#", ""))
      );
      console.log("Attempting to scroll to:", `#${sanitizedHash}`);
      const element = document.querySelector(`#${sanitizedHash}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn(`Element with ID #${sanitizedHash} not found`);
      }
    }, 500);
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.home-container {
  margin: 0 auto;
  padding: 60px 20px 27px 20px;
  background-color: #2e2e32;
  color: #ffffff;
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
}

/* Welcome Section Styles */
.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  background: #2e2e32;
  position: relative;
  overflow: hidden;
}

.welcome-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h100v100H0z" fill="none"/><path d="M20 20L80 20M20 40L80 40M20 60L80 60M20 80L80 80" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></svg>');
  opacity: 0.5;
}

.welcome-content {
  text-align: center;
  max-width: 700px;
  padding: 3rem;
  animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  z-index: 2;
}

.logo-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 3rem;
}

.logo-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-logo {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
  opacity: 0.9;
}

.cmd-text {
  color: #ffffff;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.welcome-container h2 {
  font-size: 3.5rem;
  margin: 1rem 0 0.5rem;
  color: white;
  font-weight: 700;
  letter-spacing: -1px;
  text-transform: uppercase;
}

.welcome-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.welcome-description {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.tech-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Documentation Content Styles */
.main_content__theme {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #2e2e32;
  color: #ffffff;
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.content-section {
  margin-bottom: 3rem;
}

pre {
  background: #3a3a3f;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  color: #f8f8f2;
  margin: 1.5rem 0;
  border: 1px solid #4a4a4f;
  font-size: 1rem;
}

code {
  font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
  color: #f8f8f2;
  font-size: 1rem;
}

.error {
  padding: 1.5rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  font-size: 1.1rem;
  margin: 1rem 0;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 2rem 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #4a4a4f;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin: 2.5rem 0 1.5rem;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 2rem 0 1rem;
}

p {
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .welcome-content {
    padding: 2rem 1.5rem;
  }
  
  .logo-container {
    width: 160px;
    height: 160px;
    margin-bottom: 2.5rem;
  }
  
  .welcome-logo {
    width: 90px;
    height: 90px;
  }
  
  .welcome-container h2 {
    font-size: 2.5rem;
  }
  
  .welcome-subtitle {
    font-size: 1.2rem;
  }
  
  .welcome-description {
    font-size: 1.1rem;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
    max-width: 300px;
  }

  .home-container {
    padding: 60px 15px 27px 15px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .welcome-container h2 {
    font-size: 2rem;
  }
  
  .logo-container {
    width: 140px;
    height: 140px;
  }
  
  .welcome-logo {
    width: 80px;
    height: 80px;
  }
}
</style>
