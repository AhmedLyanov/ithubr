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
      this.loading = true
      try {
        const response = await axios.get('https://6744a6fdb4e2e04abea31a7f.mockapi.io/systemCards')
        console.log('API Response:', JSON.stringify(response.data, null, 2))
        this.frameworks = response.data[0].frameworks.map(framework => ({
          id: framework.id.toString(), // Ensure ID is string for route matching
          name: framework.name,
          description: framework.description || `Overview of ${framework.name}`,
          image: framework.image || `/assets/${framework.name.toLowerCase()}.svg`,
          topics: framework.topics.map(topic => ({
            id: topic.id.toString(), // Ensure ID is string
            title: topic.title,
            description: topic.description,
            subtopics: topic.subtopics.map((subtopic, index) => ({
              name: subtopic,
              content: {
                description: `Details about ${subtopic} in ${framework.name}`,
                image: `/assets/${framework.name.toLowerCase()}-${subtopic.toLowerCase().replace(/\s+/g, '-')}.png`,
                code: topic.examples[index] || `// No example available for ${subtopic}`
              }
            }))
          }))
        }))
        this.error = null
      } catch (err) {
        this.error = err.message
        console.error('Error fetching data:', err)
      } finally {
        this.loading = false
      }
    },

    getContent(frameworkId, topicId, subtopicName) {
      const framework = this.frameworks.find(f => f.id === frameworkId)
      if (!framework) {
        console.warn('Framework not found:', frameworkId)
        return null
      }
      const topic = framework.topics.find(t => t.id === topicId)
      if (!topic) {
        console.warn('Topic not found:', topicId)
        return null
      }
      const subtopic = topic.subtopics.find(s => s.name === subtopicName)
      if (!subtopic) {
        console.warn('Subtopic not found:', subtopicName)
        return null
      }
      return subtopic.content
    }
  }
})