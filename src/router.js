import { createWebHashHistory, createRouter } from 'vue-router'

import GerenciamentoView from './views/GerenciamentoView.vue'

const routes = [
    { path: '/gerenciamento', component: GerenciamentoView}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router