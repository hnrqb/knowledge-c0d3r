<template>
    <div class="articles-by-category">
        <PageTitle icon="fa fa-folder-o"
            :main="category.name" sub="Categoria">
        </PageTitle>
        <ul>
            <li v-for="article in articles" :key="article.id">
                <ArticleItem :article="article"></ArticleItem>
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore" class="btn btn-lg btn-outline-primary"
                @click="getArticles">Carregar mais artigos...
            </button>
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'
import ArticleItem from './ArticleItem'

export default {
    name: 'ArticleByCategory',
    components: { PageTitle, ArticleItem },
    data: function() {
        return {
            category: {},
            articles: [],
            page: 1,
            loadMore: true,
        }
    },
    methods: {
        getCategory() {
            const url = `${baseApiUrl}/categories/${this.category.id}`
            axios(url).then(res => this.category = res.data)
        },
        getArticles() {
            const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`;
            
            axios(url).then(res => {
                const articles = res.data;
                this.articles = this.articles.concat(articles);

                const isFirstPage = this.page === 1;
                const hasNoArticles = articles.length === 0;

                if (hasNoArticles) {
                    this.loadMore = false;
                    const message = isFirstPage
                        ? 'Nenhum artigo cadastrado nesta categoria.'
                        : 'Você está vendo todos os artigos desta categoria.';
                    this.$toasted.global.defaultInfo({ msg: message });
                }

                if (articles.length > 0) {
                    this.page++;
                }
            })
            .catch(error => {
                this.$toasted.global.defaultError({ msg: 'Erro ao buscar artigos. Tente novamente mais tarde.' });
            });
        }
    },
    watch: {
        $route(to) {
            this.category.id = to.params.id
            this.articles = []
            this.page = 1
            this.loadMore = true

            this.getCategory()
            this.getArticles()
        }
    },
    mounted() {
        this.category.id = this.$route.params.id
        this.getCategory()
        this.getArticles()
    }
}
</script>

<style>
    .articles-by-category ul {
        list-style-type: none;
        padding: 0px;
    }

    .articles-by-category .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>