<template>
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/logo.png" alt="Logo" width="200" />
            <hr>
            <div class="auth-title">{{ showSignUp ? 'Cadastro' : 'Login' }}</div>
            
            <input v-if="showSignUp" v-model="user.name" type="text" placeholder="Nome">
            <input v-model="user.email" type="email" placeholder="E-mail">
            <input v-model="user.password" type="password" placeholder="Senha">
            <input v-if="showSignUp" v-model="user.confirm_password" 
                type="password" placeholder="Confirme a Senha">

            <button v-if="showSignUp" @click="signUp" class="btn btn-md btn-primary">Registrar</button>
            <button v-else @click="signIn" class="btn btn-md btn-primary">Entrar</button>

            <a href @click.prevent="showSignUp = !showSignUp">
                <span v-if="showSignUp">Já tem cadastro? Acesse o Login!</span>
                <span v-else>Não tem cadastro? Registre-se!</span>
            </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey} from '@/global'
import axios from 'axios'

export default {
    name: 'Auth',
    data: function() {
        return {
            showSignUp: false, 
            user: {
                method: 'post'
            }
        }
    },
    methods: {
        signIn() {
            axios.post(`${baseApiUrl}/sign-in`, this.user)
                .then(res => {
                    this.$store.commit('setUser', res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    this.$router.push({ path: '/' })
                })
                .catch(showError)
        },
        signUp() {
            axios.post(`${baseApiUrl}/sign-up`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.user = {}
                    this.showSignUp = false
                })
                .catch(showError)
        }
    }
}
</script>

<style>
    .auth-content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .auth-modal {
        background-color: #FFFFFF;
        width: 350px;
        padding: 35px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .auth-title {
        font-size: 1.2rem;
        font-weight: 100;
        margin-top: 10px;
        margin-bottom: 15px;
    }

    .auth-modal input {
        border: 1px solid #BBBBBB;
        width: 100%;
        margin-bottom: 15px;
        padding: 3px 8px;
        outline: none;
    }

    .auth-modal a {
        margin-top: 35px;
    }

    .auth-modal hr {
        border: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to right, 
            rgba(120, 120, 120, 0),
            rgba(120, 120, 120, 0.75),
            rgba(120, 120, 120, 0));
    }
</style>
