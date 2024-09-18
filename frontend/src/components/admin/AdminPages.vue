<template>
    <div class="admin-pages">
        <PageTitle 
            icon="fa fa-home"
            main="Administração do Sistema"
            sub="Cadastros & Cia"
        >
        </PageTitle>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'

export default {
    name: 'AdminPages',
    components: { PageTitle }
}
</script>