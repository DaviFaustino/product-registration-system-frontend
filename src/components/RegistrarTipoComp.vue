<script setup>
import axios from 'axios'
import { computed, ref } from 'vue'

const nome = ref('')
let categoria = 'BAKING'
let fatorEstoque = '1'

const mensagemResultado = ref('');
const corMensagem = ref('');
const habilitarMostrarRestricao = ref(false);

const mostrarRestricaoTamanhoNomeTipo = computed(() => {
   return (habilitarMostrarRestricao.value && (nome.value.length < 3 || nome.value.length > 32)) ? true : false;
});

function enviarFormulario() {
    habilitarMostrarRestricao.value = true;
    if (mostrarRestricaoTamanhoNomeTipo.value) {
        return;
    }

    const dados = {
        name: nome.value,
        category: categoria,
        fullStockFactor: fatorEstoque
    }

    const backendURL = import.meta.env.VITE_BACKEND_URL

    axios.post(backendURL + '/v1/product-types', dados)
        .then(response => {
            console.log('Resposta: ', response.data, 'Status: ', response.status)
            nome.value = '';

            mensagemResultado.value = 'Produto salvo!';
            corMensagem.value = 'text-green-500';

            habilitarMostrarRestricao.value = false;
        })
        .catch(error => {
            mensagemResultado.value = error.response.data.message;
            corMensagem.value = 'text-red-600';
        })
}
</script>

<template>
    <div class="w-full flex flex-col items-center border-x-2 border-orange-400">
        <h2 class="text-lg w-40 text-center text-orange-800 font-bold border-y-2 border-orange-400">Registrar Tipo</h2>
        
        <form @submit.prevent="enviarFormulario" class="mt-8 space-y-2" autocomplete="off">
            <div>
                <div id="area-nome">
                    <label for="nome" class="text-orange-600 font-bold">Nome: </label>
                    <input type="text" id="nome" v-model="nome" class="w-52 border-2 border-orange-400"></input>
                </div>
                
                <label for="area-nome" v-if="mostrarRestricaoTamanhoNomeTipo" class="text-red-500 text-sm">*o nome precisa ter entre 3 e 32 caracteres!</label>
            </div>

            <div>
                <label for="categorias" class="text-orange-600 font-bold">Categoria: </label>
                <select id="categorias" v-model="categoria" class="bg-orange-600 border-2 border-orange-400 rounded-md h-7 text-white">
                    <option value="BAKING">Panificação</option>
                    <option value="CANDIES_AND_SNACKS">Bobons e Salgadinhos</option>
                    <option value="BEVERAGES_AND_DAIRY_PRODUCTS">Bebidas e Laticínios</option>
                    <option value="FOOD_STAPLES_FOR_RESALE">Alimentos revenda</option>
                    <option value="CLEANING_AND_HYGIENE">Limpeza e Higiene</option>
                    <option value="RAW_MATERIALS">Matéria prima</option>
                    <option value="OTHERS">Outros</option>
                </select>
            </div>

            <div>
                <label for="fatorEstoque" class="text-orange-600 font-bold">Fator Estoque Cheio: </label>
                <select id="fatorEstoque" v-model="fatorEstoque" class="bg-orange-600 border-2 border-orange-400 rounded-md h-7 w-12 text-center text-white">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>

            <div class="h-full"></div>

            <div class="w-full flex justify-center">
                <button type="submit" class="h-7 w-20 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Salvar</button>
            </div>
        </form>

        <div class="my-8 w-4/5 text-center text-lg break-words" :class="corMensagem">{{ mensagemResultado }}</div>
    </div>

    <div class="h-1 w-full bg-orange-600 my-10"></div>
</template>