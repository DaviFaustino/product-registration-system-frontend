<script setup>
import axios from 'axios';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const listaTipos = reactive([]);
const categorias = new Map();
const tipoSelecionado = ref('');
let termoBusca = '';
let categoria = '';

categorias.set("PANIFICAÇÃO", "Panificação");
categorias.set("BOBONS_E_SALGADINHOS", "Bonbos e salgadinhos");
categorias.set("BEBIDAS_E_LATICÍNIOS", "Bebidas e laticínios");
categorias.set("ALIMENTOS_REVENDA", "Alimentos de revenda");
categorias.set("LIMPEZA_E_HIGIENE", "Limpeza e higiene");
categorias.set("MATÉRIA_PRIMA", "Matéria prima");
categorias.set("OUTROS", "Outros");

function realizarBuscaTipo() {
   const backendURL = import.meta.env.VITE_BACKEND_URL

   axios.get(backendURL + '/product-types?' + 'searchTerm=' + encodeURIComponent(termoBusca) + ((categoria != '') ? ('&' + 'category=' + encodeURIComponent(categoria)) : ''))
      .then(response => {
         listaTipos.value = response.data;
      })
      .catch(error => {
         console.error('Erro: ', error)
      });
}

function botaoTipo(name) {
   if (tipoSelecionado.value !== name) {
      tipoSelecionado.value = name;
   } else {
      tipoSelecionado.value = '';
   }
}

const router = useRouter();

function atualizarTipo(opcao, busca) {
   router.push({ name: 'Gerenciamento', params: { opcao, busca } });
}

</script>

<template>
   <form @submit.prevent="realizarBuscaTipo" class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
      <input type="text" id="nome" placeholder="Insira a busca" v-model="termoBusca" class="w-52 h-8 border-2 border-orange-600" autocomplete="off"></input>

      <select id="categorias" v-model="categoria"
         class="bg-orange-600 border-2 border-orange-600 rounded-md w-52 h-8 text-white">
         <option value="" selected>sem categoria</option>
         <option value="PANIFICAÇÃO">Panificação</option>
         <option value="BOBONS_E_SALGADINHOS">Bobons e Salgadinhos</option>
         <option value="BEBIDAS_E_LATICÍNIOS">Bebidas e Laticínios</option>
         <option value="ALIMENTOS_REVENDA">Alimentos revenda</option>
         <option value="LIMPEZA_E_HIGIENE">Limpeza e Higiene</option>
         <option value="MATÉRIA_PRIMA">Matéria prima</option>
         <option value="OUTROS">Outros</option>
      </select>

      <div class="h-8 w-20 flex items-center justify-center">
         <button type="submit"
            class="h-7 w-16 bg-orange-700 hover:h-8 hover:w-20 duration-200 rounded-lg text-center text-white font-bold">Buscar</button>
      </div>
   </form>

   <div class="my-7">
      <ul>
         <li v-for="tipo in listaTipos.value" :key="tipo.name" :id="tipo.name" class="flex items-center w-96 my-1 p-1 border-2 rounded-md"
            :class="[tipoSelecionado === tipo.name ? 'bg-orange-500 border-orange-500' : 'bg-orange-400 border-orange-400']">
            <button type="button" @click="() => botaoTipo(tipo.name)" class="w-full">
               <div class="flex flex-col w-full items-start">
                  <div class="flex">
                     <span class="w-[19rem] text-left font-bold text-lg text-orange-950">{{ tipo.name }}</span>
                     <button @click="atualizarTipo('a-tipo', tipo.name)" class="text-sm text-white bg-orange-600 w-16 h-7 rounded-lg hover:bg-orange-700 duration-150 border-2 border-orange-800" :class="[(tipoSelecionado === tipo.name) ? '' : 'hidden']">editar</button>
                  </div>

                  <span class="text-orange-950">categoria: {{ categorias.get(tipo.category) }}</span>
                  <span class="maisDetalhesTipo text-orange-950" :class="[(tipoSelecionado === tipo.name) ? '' : 'hidden']">preço médio: {{ tipo.averagePriceInCents / 100 }} reais</span>
                  <span class="maisDetalhesTipo text-orange-950" :class="[(tipoSelecionado === tipo.name) ? '' : 'hidden']">fator de estoque: {{ tipo.fullStockFactor }}</span>
               </div>
            </button>
         </li>
      </ul>
   </div>
</template>
