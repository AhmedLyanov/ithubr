import { defineStore } from 'pinia'
import axios from 'axios'

export const useApiStore = defineStore('api', {
  state: () => ({
    frameworks: [],
    loading: false,
    error: null,
  }),

  actions: {
async fetchFrameworks() {
  this.loading = true;
  try {
    const response = await axios.get('/api/frameworks', {
  baseURL: 'https://vaykino.ru',
  withCredentials: true
});
    
    const frameworksData = Array.isArray(response.data) 
      ? response.data[0]?.frameworks || response.data 
      : response.data.frameworks || response.data;

    this.frameworks = frameworksData.map(framework => ({
      id: framework.id?.toString() || Math.random().toString(),
      name: framework.name || 'Unnamed Framework',
      description: framework.description || `Overview of ${framework.name || 'framework'}`,
      image: framework.image || `/assets/default.svg`,
      topics: (framework.topics || []).map(topic => ({
        id: topic.id?.toString() || Math.random().toString(),
        title: topic.title || 'Untitled Topic',
        description: topic.description || '',
        subtopics: (topic.subtopics || []).map((subtopic, index) => ({
          name: typeof subtopic === 'string' ? subtopic : subtopic.name || `Subtopic ${index}`,
          content: {
            description: topic.description || `${subtopic} in ${framework.name}`,
            image: `/assets/${framework.name?.toLowerCase() || 'default'}-${index}.png`,
            code: topic.examples?.[index] || `// No example available`
          }
        }))
      }))
    }));
    
    this.error = null;
  } catch (err) {
    this.error = err.message;
    console.error('Error fetching data:', err);
  } finally {
    this.loading = false;
  }
},

    getContent(frameworkId, topicId, subtopicName) {
      const framework = this.frameworks.find(f => f.id === frameworkId)
      if (!framework) return null
      const topic = framework.topics.find(t => t.id === topicId)
      if (!topic) return null
      const subtopic = topic.subtopics.find(s => s.name === subtopicName)
      return subtopic?.content || null
    }
  }
})
