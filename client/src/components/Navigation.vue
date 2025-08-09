<template>
  <nav class="nav__container-is">
    <div 
      v-for="(item, index) in navItems" 
      :key="index"
      class="nav-item-wrapper"
      @mouseenter="setActive(index)"
      @mouseleave="resetActive"
    >
      <a
        class="navigation__href-button"
        :class="{ 
          'active': activeIndex === index, 
          'inactive': activeIndex !== null && activeIndex !== index,
          'has-dropdown': item.dropdown
        }"
        :href="item.link"
      >
        <span>{{ item.text }}</span>
      </a>
      
      <div 
        v-if="item.dropdown" 
        class="dropdown-menu"
        :class="{ 'visible': activeIndex === index }"
        @mouseenter="keepDropdownOpen(index)"
        @mouseleave="closeDropdown"
      >
        <a 
          v-for="(subItem, subIndex) in item.dropdown" 
          :key="subIndex"
          :href="subItem.link"
          class="dropdown-item"
        >
          {{ subItem.text }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        { text: "ИИ", link: "/ai" },
        { 
          text: "О нас", 
          link: "/about",
          dropdown: [
            { text: "Команда", link: "/team" },
            { text: "История", link: "/history" },
            { text: "Миссия", link: "/mission" }
          ]
        },
        { text: "Тесты", link: "/tests" },
        { text: "Сотрудничество", link: "/collaboration" }
      ],
      activeIndex: null,
      dropdownTimeout: null
    };
  },
  methods: {
    setActive(index) {
      clearTimeout(this.dropdownTimeout);
      this.activeIndex = index;
    },
    resetActive() {
      this.dropdownTimeout = setTimeout(() => {
        this.activeIndex = null;
      }, 200);
    },
    keepDropdownOpen(index) {
      clearTimeout(this.dropdownTimeout);
      this.activeIndex = index;
    },
    closeDropdown() {
      this.dropdownTimeout = setTimeout(() => {
        this.activeIndex = null;
      }, 200);
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.nav__container-is {
  display: flex;
  gap: 20px;
  height: 100%;
  align-items: center;
  position: relative;
}

.nav-item-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.navigation__href-button {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 10px 0;
  display: block;
}

.navigation__href-button.active {
  opacity: 1;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.navigation__href-button.inactive {
  opacity: 0.3;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2a2a2f;
  border-radius: 6px;
  padding: 10px 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.dropdown-menu.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #3a3a3f;
}

.navigation__href-button.has-dropdown::after {
  content: "▼";
  font-size: 0.6em;
  margin-left: 5px;
  opacity: 0.7;
}
</style>