<template>
    <div class="user-admin">
        <b-form ref="userForm">
            <input type="hidden" name="user_id" :value="user.id" />
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="user-name">
                        <b-form-input id="user-name" type="text"
                            v-model="user.name" required 
                            :readonly="mode === 'remove'"
                            placeholder="Informe o Nome do Usuário..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="E-mail:" label-for="user-email">
                        <b-form-input id="user-email" type="text"
                            v-model="user.email" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o E-mail do Usuário..." />
                    </b-form-group>
                </b-col>                
            </b-row>
            <b-form-checkbox id="user-admin" v-model="user.admin" 
                class="mt-2 mb-2" :disabled="mode === 'remove'">
                Administrador?
            </b-form-checkbox>
            <b-row v-show="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha:" label-for="user-password">
                        <b-form-input id="user-password" type="password" 
                            v-model="user.password" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe a Senha do Usuário..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de Senha:" 
                        label-for="user-confirm-password">
                        <b-form-input id="user-confirm-password" type="password" 
                            v-model="user.confirm_password" required
                            :readonly="mode === 'remove'"
                            placeholder="Confirme a Senha do Usuário..." />
                    </b-form-group>
                </b-col>                
            </b-row>
            <b-row>
                <b-col md="12">
                    <b-button variant="primary" v-if="mode === 'save'"
                        @click="save">Salvar</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'"
                        @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <hr>
        <b-table hover striped :items="users" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadUser(data.item, 'remove')">
                    <i class="fa fa-remove"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" 
            :per-page="limit">
        </b-pagination>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'

export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save',
            user: {},
            users: [],
            fields: [
                { key: 'id', label: '#', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true },
                { key: 'admin', label: 'Administrador', sortable: true,
                    formatter: value => value ? 'Sim' : 'Não' },
                { key: 'actions', label: 'Ações'}
            ],
            page: 1,
            count: 0,
            limit: 0,
        }
    },
    methods: {
        loadUsers() {
            const url = `${baseApiUrl}/users?page=${this.page}`
            axios.get(url).then(res => {
                this.users = res.data.users
                this.count = res.data.count
                this.limit = res.data.pagination_limit
            })
        },
        reset() {
            this.mode = 'save'
            this.user = {}
            this.loadUsers()
        },
        save() {
            const method = this.user.id ? 'put' : 'post'
            const url = !this.user.id ? `${baseApiUrl}/users` : `${baseApiUrl}/users/${this.user.id}`
            this.user.method = method

            axios[method](url, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.user.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadUser(user, mode = 'save') {
            this.mode = mode
            this.user = { ...user }
            this.moveToForm()
            if (this.isRemoveMode()) {
                this.showRemoveConfirmationMessage()
            }
        },
        moveToForm() {
            this.$nextTick(() => {
                this.$refs.userForm.scrollIntoView({
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
    mounted() {
        this.loadUsers()
    }
}
</script>