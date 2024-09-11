<script setup>
import axios from 'axios';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import LeitorCodigoBarraComp from './LeitorCodigoBarraComp.vue';

const listaProdutos = reactive([]);
const tipoProduto = reactive({ nome: '' });
const produtoSelecionado = ref('');
const busca = ref('');
let nomesTipos = [];
const estoqueCheio = ref('');
const mensagemResultado = ref('');
const corMensagem = ref('');

const backendURL = import.meta.env.VITE_BACKEND_URL;

function atualizarBusca(novoCodigo) {
   busca.value = novoCodigo;
   realizarBuscaProduto();
}

function buscarTipos() {

   if (nomesTipos.length === 0) {      
      axios.get(backendURL + '/v1/product-types/names')
      .then(response => {
         nomesTipos = response.data;
      })
      .catch(error => {
         console.error('Erro: ', error.response.data);
      })
   }
}

const mostrarTipos = computed(() => {
   return (tipoProduto.nome.replace(/\s+/g, '') !== '' && document.activeElement.id === 'tipo-produto') ? true : false;
});

const tiposFiltrados = computed(() => {
   let filtrados = [];

   for (let i = 0; i < nomesTipos.length; i++) {
      if (nomesTipos.at(i).toLowerCase().includes(tipoProduto.nome.toLowerCase())) {
         filtrados.push(nomesTipos.at(i));
      }
   }
   return filtrados;
});

function tipoSelecionado(tipo) {
   tipoProduto.nome = tipo;
}

function realizarBuscaProduto() {

   axios.get(backendURL + '/v1/products?' + 'searchTerm=' + encodeURIComponent(busca.value) + ((tipoProduto.nome.replace(/\s+/g, '') !== '' && busca.value.replace(/\s+/g, '').match(/^[0-9]+$/g) === null) ? ('&' + 'productTypeName=' + encodeURIComponent(tipoProduto.nome)) : ''))
      .then(response => {
         listaProdutos.value = response.data;
         mensagemResultado.value = informeResultados.value;
         corMensagem.value = 'text-orange-600';
      })
      .catch(error => {
         mensagemResultado.value = 'Erro: ' + error.response.data.message;
         corMensagem.value = 'text-red-600';
      });
}

function acaoBotaoProduto(produto) {
   if (produtoSelecionado.value !== produto.name) {
      produtoSelecionado.value = produto.name;

      estoqueCheio.value = produto.fullStock ? 'sim': 'não';
   } else {
      produtoSelecionado.value = '';
   }
}

const informeResultados = computed(() => { return listaProdutos.value.length + ' resultados encontrados' });

const formatDateTime = (timestamp) => {
   const date = new Date(timestamp);
   const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
   };

   if (timestamp === 0) {
      return 'Data desconhecida!';
   }
   return date.toLocaleDateString('pt-BR', options);
};

const router = useRouter();

function atualizarProduto(opcao, busca) {
   busca = 
   router.push({ name: 'Gerenciamento', params: { opcao, busca } });
}
</script>

<template>
   <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
      <div class="flex flex-col space-y-1">
         <div class="flex space-x-1">
            <input type="text" placeholder="Insira um código ou uma palavra" v-model="busca" class="w-64 h-8 border-2 border-orange-600" autocomplete="off"></input>

            <LeitorCodigoBarraComp @lido="atualizarBusca"/>
         </div>

         <div :class="[mostrarTipos ? 'relative':'']">
            <input type="text" id="tipo-produto" placeholder="Insira um tipo de produto" v-model="tipoProduto.nome" @focus="buscarTipos()" class="w-64 h-8 border-2 border-orange-600" autocomplete="off"></input>

            <div v-if="mostrarTipos" class="absolute w-64 max-h-44 overflow-y-auto top-full bg-orange-700 bg-opacity-80 text-white">
               <ul>
                  <li v-for="tipo in tiposFiltrados" :key="tipo" :id="tipo">
                     <button type="button" @click="tipoSelecionado(tipo)" class="w-full hover:bg-orange-800">{{ tipo }}</button>
                  </li>
               </ul>
            </div>
         </div>
      </div>

      <div class="h-8 w-20 pt-1 sm:pt-0">
         <button type="button" @click="realizarBuscaProduto()" class="h-8 w-20 bg-orange-700 rounded-lg text-center text-white font-bold">Buscar</button>
      </div>
   </div>

   <div class="my-6 w-4/5">
      <span class=" text-center text-lg break-words" :class="corMensagem">{{ mensagemResultado }}</span>
   </div>

   <div class="mb-7">
      <ul>
         <li v-for="produto in listaProdutos.value" :key="produto.name" :id="produto.name" class="flex items-center w-96 my-1 p-1 border-2 rounded-md"
            :class="[produtoSelecionado === produto.name ? 'bg-orange-500 border-orange-700' : 'bg-orange-400 border-orange-400']">
            <button type="button" @click="acaoBotaoProduto(produto)" class="w-full">
               <div class="flex flex-col w-full items-start">
                  <div class="flex">
                     <span class="font-bold w-[19rem] text-left text-lg text-orange-950">{{ produto.name }}</span>
                     <button @click="atualizarProduto('a-produto', produto.code)" class="text-sm text-white bg-orange-600 w-16 h-7 rounded-lg hover:bg-orange-700 duration-150 border-2 border-orange-800" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">editar</button>
                  </div>

                  <div class="flex">
                     <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">código: </span>
                     <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">{{ produto.code }}</span>
                  </div>

                  <div class="flex">
                     <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">tipo: </span>
                     <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">{{ produto.productTypeName }}</span>
                  </div>

                  <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">descrição:</span>

                  <div class="flex w-full justify-end"  :class="[(produtoSelecionado === produto.name) ? 'mb-3' : '']">
                     <span class="w-80 text-left text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">{{ produto.description }}</span>
                  </div>

                  <div class="flex">
                     <div class="w-48 flex flex-col items-start">
                        <div class="flex">
                           <span class="text-orange-950">venda:</span>
                           <span :class="[(produtoSelecionado === produto.name) ? 'text-orange-200' : 'text-orange-950']">R${{ produto.salePriceInCents / 100 }}</span>
                        </div>

                        <div class="flex">
                           <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">ve. anterior: </span>
                           <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">R${{ produto.previousSalePriceInCents / 100 }}</span>
                        </div>
                     </div>
                     <div class="w-48 flex flex-col items-start">
                        <div class="flex">
                           <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">compra: </span>
                           <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">R${{ produto.purchasePriceInCents / 100 }}</span>
                        </div>

                        <div class="flex">
                           <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">co. anterior: </span>
                           <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">R${{ produto.previousPurchasePriceInCents / 100 }}</span>
                        </div>
                     </div>
                  </div>

                  <div class="flex flex-col items-start">
                     <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">ultima atualização: </span>
                     <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">{{ formatDateTime(produto.priceUpdateDate) }}</span>
                  </div>

                  <div class="flex">
                     <span class="text-orange-950" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">abastecido: </span>
                     <span class="text-orange-200" :class="[(produtoSelecionado === produto.name) ? '' : 'hidden']">{{ estoqueCheio }}</span>
                  </div>
               </div>
            </button>
         </li>
      </ul>
   </div>
</template>