<template>
  <aside class="menu" :class="isMenuVisible ? 'show-menu' : 'hide-menu'"></aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Menu',
    computed: mapState(['isMenuVisible'])
}
</script>

<style>
    .menu {
        grid-area: menu;
        background: linear-gradient(to right, #232526, #414345);
        width: 300px;
        transition: width 0.4s ease;
        overflow: hidden;
    }

    .hide-menu {
        width: 0;
    }

    .show-menu {
        width: 300px;
    }
</style>
