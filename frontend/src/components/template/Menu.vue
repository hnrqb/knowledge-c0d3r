<template>
    <aside class="menu" :class="isMenuVisible ? 'show-menu' : 'hide-menu'">
        <div class="menu-filter">
            <i class="fa fa-search"></i>
            <input class="filter-filed" type="text"
                v-model="treeFilter" placeholder="Digite para filtrar"/>
        </div>
        <Tree :data="treeData" :options="treeOptions"
            :filter="treeFilter" ref="tree">
        </Tree>
    </aside>
</template>

<script>
import { mapState } from 'vuex'
import Tree from 'liquor-tree'
import { baseApiUrl } from '@/global'
import axios from 'axios'

export default {
    name: 'Menu',
    components: { Tree },
    computed: mapState(['isMenuVisible']),
    data: function() {
        return {
            treeData: this.getTreeData(),
            treeFilter: '',
            treeOptions: {
                propertyNames: { 'text': 'name' },
                filter: { emptyText: 'Categoria não encontrada' }
            },
        }
    },
    methods: {
        async getTreeData() {
            const url = `${baseApiUrl}/categories/tree`
            return await axios(url).then(res => res.data)
        },
        onNodeSelect(node) {
            this.$router.push({
                name: 'articleByCategory',
                params: { id: node.id }
            })

            if(this.$mq === 'xs' || this.$mq === 'sm') {
                this.$store.commit('toggleMenu', false)
            }
        }
    },
    mounted() {
        this.$refs.tree.$on('node:selected', this.onNodeSelect)
    }
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

    .menu a,
    .menu a:hover {
        color: #FFFFFF;
        text-decoration: none;
        border-radius: 8px;
    }
    
    .menu .tree-node.selected > .tree-content,
    .menu .tree-node .tree-content:hover {
        background: linear-gradient(to right, #000000, #414345);
        transition: 0.5s;
    }
    
    .menu a:hover {
        transition: 0.5s;
        margin-left: 15px;
    }

    .tree > .tree-root {
        padding: 0px;
    }

    .tree-anchor span {
        margin: 5px 5px 5px 10px;
    }

    .tree-content i {
        color:#FFFFFF;
    }

    .tree-arrow.has-child {
        filter: brightness(2);
    }

    .menu .menu-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px;
        padding-bottom: 8px;
        border-bottom: solid 1px #AAAAAA;
    }

    .menu .menu-filter i {
        color: #AAAAAA;
        margin-right: 10px;
    }

    .menu input {
        color: #CCCCCC;
        font-size: 1.3rem;
        border: 0;
        outline: 0;
        width: 100%;
        background-color: transparent;
    }

    .tree-filter-empty {
        color: #CCCCCC;
        font-size: 1.3rem;
        margin-left: 20px;
    }
</style>
