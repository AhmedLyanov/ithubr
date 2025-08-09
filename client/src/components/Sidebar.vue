<template>
  <aside>
    <div class="container__sidebar__main_content">
     
      <div class="container__logo-Sector_IT">
        <Logo />
      </div>


      <div class="scrollable-content">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else class="container__content_sidebar">
          <div
            v-for="framework in frameworks"
            :key="framework.id"
            class="framework-section"
          >
            <div
              class="framework-header"
              :class="{ active: activeFramework === framework.id }"
              @click="selectFramework(framework.id)"
            >
            <div class="container__framework-info">
              <img class="logotype__framework" :src="framework.image" width="30px" height="30px">
              <span>{{ framework.name }}</span>
            </div>
              <span class="arrow">{{
                expandedFrameworks.includes(framework.id) ? "▼" : "▶"
              }}</span>
            </div>

            <transition name="slide-fade">
              <div
                v-if="expandedFrameworks.includes(framework.id)"
                class="topics-container"
              >
                <div
                  v-for="topic in framework.topics"
                  :key="topic.id"
                  class="topic-item"
                >
                  <div
                    class="topic-header"
                    :class="{
                      active:
                        activeTopic === topic.id &&
                        activeFramework === framework.id,
                    }"
                    @click="selectTopic(framework.id, topic.id)"
                  >
                    <span>{{ topic.title }}</span>
                    <span class="arrow">{{
                      expandedTopics[framework.id]?.includes(topic.id) ? "▼" : "▶"
                    }}</span>
                  </div>

                  <transition name="slide-fade">
                    <div
                      v-if="expandedTopics[framework.id]?.includes(topic.id)"
                      class="subtopics-container"
                    >
                      <div
                        v-for="(subtopic, index) in topic.subtopics"
                        :key="index"
                        class="subtopic-item"
                        :class="{
                          active:
                            activeSubtopic === subtopic.name &&
                            activeTopic === topic.id &&
                            activeFramework === framework.id,
                        }"
                        @click="
                          selectSubtopic(framework.id, topic.id, subtopic.name)
                        "
                      >
                        {{ subtopic.name }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useApiStore } from "../store/apiTopics";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import Logo from "./";
const apiStore = useApiStore();
const { frameworks, loading, error } = storeToRefs(apiStore);
const route = useRoute();
const router = useRouter();

const expandedFrameworks = ref([]);
const expandedTopics = ref({});

const activeFramework = computed(() => route.params.frameworkId);
const activeTopic = computed(() => route.params.topicId);
const activeSubtopic = computed(() =>
  decodeURIComponent(route.params.subtopicName || "")
);
const sanitizeId = (name) => {
  if (!name) return "";
  return name.toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-").trim();
};

const toggleFramework = (frameworkId) => {
  const index = expandedFrameworks.value.indexOf(frameworkId);
  if (index > -1) {
    expandedFrameworks.value.splice(index, 1);
    delete expandedTopics.value[frameworkId];
  } else {
    expandedFrameworks.value.push(frameworkId);
  }
};

const toggleTopic = (frameworkId, topicId) => {
  if (!expandedTopics.value[frameworkId]) {
    expandedTopics.value[frameworkId] = [];
  }
  const topics = expandedTopics.value[frameworkId];
  const topicIndex = topics.indexOf(topicId);
  if (topicIndex > -1) {
    topics.splice(topicIndex, 1);
  } else {
    topics.push(topicId);
  }
  expandedTopics.value = { ...expandedTopics.value };
};

const selectFramework = (frameworkId) => {
  toggleFramework(frameworkId);
  router.push({ name: "Framework", params: { frameworkId } });
};

const selectTopic = (frameworkId, topicId) => {
  toggleTopic(frameworkId, topicId);
  router.push({ name: "Topic", params: { frameworkId, topicId } });
};

const selectSubtopic = (frameworkId, topicId, subtopicName) => {
  const sanitizedHash = sanitizeId(subtopicName);
  const encodedSubtopicName = encodeURIComponent(subtopicName);
  router.push({
    name: "Subtopic",
    params: { frameworkId, topicId, subtopicName: encodedSubtopicName },
    hash: `#${sanitizedHash}`,
  });
};

onMounted(() => {
  apiStore.fetchFrameworks();
  if (activeFramework.value) {
    expandedFrameworks.value.push(activeFramework.value);
  }
  if (activeTopic.value && activeFramework.value) {
    expandedTopics.value[activeFramework.value] = [activeTopic.value];
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

aside {
  background: #1b1b1f;
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
}

.container__sidebar__main_content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.container__logo-Sector_IT {
 
  border-bottom: 1px solid #2e2e32;
  flex-shrink: 0;
  height: 60px;
  
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
      border-right: 1px solid #2e2e32;
}

.container__framework-info{
  display: flex;
  gap: 10px;
  align-items: center;
}

.logotype__framework{
  object-fit: cover;
}

.framework-section {
  margin-bottom: 0.5rem;
}

.framework-header {
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  user-select: none;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  transition: all 0.2s ease;
  margin: 0.125rem 0;
      display: flex
;
    place-items: center;
  font-size: 0.95rem;
}

.framework-header:hover {
  background-color: #2e2e32;
}

.topic-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0.75rem 0.4rem 1.25rem;
  user-select: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin: 0.125rem 0;
}

.topic-header:hover {
  background-color: #2e2e32;
}

.topics-container {
  margin-left: 0.75rem;
  border-left: 1px solid #2e2e32;
  padding-left: 0.5rem;
}

.subtopics-container {
  margin-left: 0.75rem;
  border-left: 1px solid #2e2e32;
  padding-left: 1rem;
}

.subtopic-item {
  padding: 0.3rem 0.75rem 0.3rem 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin: 0.125rem 0;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.subtopic-item:hover {
  background-color: #2e2e32;
  color: rgba(255, 255, 255, 0.9);
}

.arrow {
  margin-left: 0.5rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease;
}

.loading {
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-size: 0.9rem;
}

.error {
  padding: 1rem;
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  margin: 0.5rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.framework-header.active,
.topic-header.active,
.subtopic-item.active {
  color: #42b883;
  background-color: rgba(66, 184, 131, 0.1);
}

.framework-header.active .arrow,
.topic-header.active .arrow {
  color: #42b883;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #2e2e32;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #3e3e42;
}

.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: #2e2e32 transparent;
}
</style>