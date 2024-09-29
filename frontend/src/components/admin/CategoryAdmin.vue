<template>
    <div class="category-admin">
        <b-form ref="categoryForm">
            <input id="category-id" type="hidden" v-model="category.id" />
            <b-row>
                <b-col md="8" sm="12">
                    <b-form-group label="Nome:" label-for="category-name">
                        <b-form-input id="category-name" type="text"
                            v-model="category.name" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o Nome da Categoria..." />
                    </b-form-group>
                </b-col>
                <b-col md="4" sm="12">        
                    <b-form-group label="Categoria Pai:" label-for="category-parent-id">
                        <b-form-select id="category-parent-id" :disabled="mode === 'remove'"
                            :options="filteredCategories" v-model="category.parent_id">
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>            
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="categories" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadCategory(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadCategory(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" 
            :per-page="limit">
        </b-pagination>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'CategoryAdmin',
    data: function() {
        return {
            mode: 'save',
            category: {},
            categories: [],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'path', label: 'Caminho', sortable: true },
                { key: 'actions', label: 'Ações' }
            ],
            page: 1,
            count: 0,
            limit: 0,
        }
    },
    methods: {
        loadCategories() {
            const url = `${baseApiUrl}/categories?page=${this.page}`
            axios(url).then(res => {
                this.categories = res.data.categories.map(category => {
                    return { ...category, value: category.id, text: category.path }
                })
                this.count = res.data.count
                this.limit = res.data.pagination_limit
            })
        },
        reset() {
            this.mode = 'save'
            this.category = {}
            this.loadCategories()
        },
        save() {
            const method = this.category.id ? 'put' : 'post'
            const id = this.category.id ? `/${this.category.id}` : ''
            axios[method](`${baseApiUrl}/categories${id}`, this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.category.id
            axios.delete(`${baseApiUrl}/categories/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadCategory(category, mode = 'save') {
            this.mode = mode
            this.category = { ...category, value: category.parent_id, text: category.path }
            this.moveToForm()
            if (this.isRemoveMode()) {
                this.showRemoveConfirmationMessage()
            }
        },
        moveToForm() {
            this.$nextTick(() => {
                this.$refs.categoryForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            })
        },
        isRemoveMode() {
            return this.mode === 'remove';
        },
        showRemoveConfirmationMessage() {
            this.$toasted.global.defaultInfo({
                msg: 'Clique em Excluir pra confirmar a exclusão.'
            })
        }
    },
    computed: {
        filteredCategories() {
            return this.categories
                .filter(cat => cat.id !== this.category.id);
        }
    },
    mounted() {
        this.loadCategories()
    }
}
</script>

<style>

</style>