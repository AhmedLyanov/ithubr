<template>
    <aside>

    </aside>
</template>

<script>
export default {

}
</script>

<style scoped>
aside {
    background: var(--main-background-color);
    width: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
}
</style>