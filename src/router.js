import { createWebHashHistory, createRouter } from 'vue-router'

import GerenciamentoView from './views/GerenciamentoView.vue'
import HomeView from './views/HomeView.vue'

const routes = [
    { path: '/', component: HomeView},
    { path: '/gerenciamento/:opcao?/:busca?', name: 'Gerenciamento', component: GerenciamentoView}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router