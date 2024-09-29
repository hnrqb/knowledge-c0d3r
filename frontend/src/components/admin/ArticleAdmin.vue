<template>
    <div class="article-admin">
        <b-form ref="articleForm">
            <input id="article-id" type="hidden" v-model="article.id" />
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="article-name">
                        <b-form-input id="article-name" type="text"
                            v-model="article.name" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o Nome do Artigo..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Imagem (URL):" label-for="article-image-url">
                        <b-form-input id="article-image-url" type="text"
                            v-model="article.image_url" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe a URL da Imagem..." />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-form-group label="Descrição:" label-for="article-description">
                <b-form-input id="article-description" type="text"
                    v-model="article.description" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe a Descrição do Artigo..." />
            </b-form-group>
            <b-row v-if="mode === 'save'">
                <b-col md="6" sm="12">        
                    <b-form-group label="Categoria:" label-for="article-catogory-id">
                        <b-form-select id="article-catogory-id"
                            :options="categories" v-model="article.category_id">
                        </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">        
                    <b-form-group label="Autor:" label-for="article-user-id">
                        <b-form-select id="article-user-id"
                            :options="users" v-model="article.user_id">
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-form-group v-if="mode === 'save'" label="Conteúdo:" label-for="article-description">
                <VueEditor v-model="article.content"
                    placeholder="Informe o Conteúdo do Artigo..." >
                </VueEditor>
            </b-form-group>
            
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="articles" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadArticle(data.item, 'remove')">
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
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            article: {},
            articles: [],
            categories: [],
            users: [],
            page: 1,
            count: 0,
            limit: 0,
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'description', label: 'Descrição', sortable: true },
                { key: 'actions', label: 'Ações' }
            ],
        }
    },
    methods: {
        loadArticles() {
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
                this.articles = res.data.articles
                this.count = res.data.count
                this.limit = res.data.pagination_limit                
            })
        },
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                this.categories = res.data.categories.map(category => {
                    return { value: category.id, text: category.path }
                })
            })
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.users.map(user => {
                    return { value: user.id, text: `${user.name} (${user.email})` }
                })
            })
        },
        reset() {
            this.mode = 'save'
            this.article = {}
            this.loadArticles()
        },
        save() {
            const method = this.article.id ? 'put' : 'post'
            const id = this.article.id ? `/${this.article.id}` : ''
            axios[method](`${baseApiUrl}/articles${id}`, this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.article.id
            axios.delete(`${baseApiUrl}/articles/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadArticle(article, mode = 'save') {
            this.mode = mode
            const url = `${baseApiUrl}/articles/${article.id}`
            axios.get(url).then(res => this.article = res.data)
            this.moveToForm()
            if (this.isRemoveMode()) {
                this.showRemoveConfirmationMessage()
            }
        },
        moveToForm() {
            this.$nextTick(() => {
                this.$refs.articleForm.scrollIntoView({
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
    watch: {
        page() {
            this.loadArticles()
        }
    },
    mounted() {
        this.loadCategories()
        this.loadArticles()
        this.loadUsers()
    }
}
</script>

<style>

</style>