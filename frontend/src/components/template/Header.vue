<template>
    <header class="header">
        <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
            <i class="fa fa-lg" :class="icon"></i>
        </a>
        <h1 class="title">
            <a href="/">{{ title }}</a>
        </h1>
        <UserDropdown v-if="!hideUserDropdown"></UserDropdown>
    </header>
</template>

<script>
import UserDropdown from './UserDropdown'

export default {
    name: "Header",
    components: { UserDropdown },
    props: {
        title: String,
        hideToggle: Boolean,
        hideUserDropdown: Boolean
    },
    computed: {
        icon() {
            return this.$store.state.isMenuVisible ? 
                "fa-angle-left" : "fa-angle-down"
        }
    },
    methods: {
        toggleMenu() {
            this.$store.commit("toggleMenu")
        }
    }
}
</script>

<style>
    .header {
        grid-area: header;
        background: linear-gradient(to right, #1e469a, #49a7c1);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        font-size: 1.2rem;
        color: #FFFFFF;
        font-weight: 100;
        flex-grow: 1;
        text-align: center;
    }

    .title a {
        color:#FFFFFF;
        text-decoration: none;
    }

    .title a:hover {
        color:#FFFFFF;
        text-decoration: none;
    }

    header.header > a.toggle {
        width: 60px;
        height: 100%;
        color: #FFFFFF;
        justify-self: flex-start;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    header.header > a.toggle:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>