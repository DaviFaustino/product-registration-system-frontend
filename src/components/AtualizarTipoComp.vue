<script setup>
import axios from 'axios';
import { ref, reactive, computed } from 'vue';
import DeletarRegistroComp from './DeletarRegistroComp.vue';

let nomesTipos = [];
const busca = ref('');
let dadosTipo;
const nome = ref(null);
const categoria = ref(null);
const fatorEstoque = ref(null);

const backendURL = import.meta.env.VITE_BACKEND_URL;

const mensagemResultado = ref('');
const corMensagem = ref('');

const mostrarDeletar = ref(false);


function buscarTipos() {
   if (nomesTipos.length === 0) {
      axios.get(backendURL + '/product-types/names')
         .then(response => {
            nomesTipos = response.data;
         })
         .catch(error => {
            mensagemResultado.value = error.data;
            corMensagem.value = 'text-red-600';
         })
   }
}

const mostrarTipos = computed(() => {
   return (busca.value.replace(/\s+/g, '') !== '' && document.activeElement.id === 'tipo-produto') ? true : false;
});

const tiposFiltrados = computed(() => {
   let filtrados = [];

   for (let i = 0; i < nomesTipos.length; i++) {
      if (nomesTipos.at(i).toLowerCase().includes(busca.value.toLowerCase())) {
         filtrados.push(nomesTipos.at(i));
      }
   }
   return filtrados;
});

function tipoSelecionado(tipo) {
   busca.value = tipo;
}

function realizarBuscaTipo() {
   axios.get(backendURL + '/product-types?' + 'searchTerm=' + encodeURIComponent(busca.value))
      .then(response => {
         dadosTipo = response.data[0];
         nome.value = dadosTipo.name;
         categoria.value = dadosTipo.category;
         fatorEstoque.value = dadosTipo.fullStockFactor;

         const updateArea = document.getElementById('update-area');
         updateArea.classList.remove('opacity-20');
         const elementos = updateArea.elements;

         for (let i = 0; i < elementos.length; i++) {
            elementos[i].disabled = false;
         }
      })
      .catch(error => {
         mensagemResultado.value = error.data;
         corMensagem.value = 'text-red-600';
      });
}

function restaurar() {
   if (!document.getElementById('bt-restaurar').disabled) {
      nome.value = dadosTipo.name;
      categoria.value = dadosTipo.category;
      fatorEstoque.value = dadosTipo.fullStockFactor;
   }
}

function enviarFormulario() {
   let dados = [];

   if (dadosTipo !== null) {
      if (nome.value !== dadosTipo.name && nome.value !== '') {
         dados.push(['name', nome.value]);
      }
      if (categoria.value !== dadosTipo.category) {
         dados.push(['category', categoria.value]);
      }
      if (fatorEstoque.value !== dadosTipo.fullStockFactor && fatorEstoque.value !== 0) {
         dados.push(['fullStockFactor', fatorEstoque.value]);
      }
   }

   if (dados.length !== 0) {
      axios.patch(backendURL + '/product-types/' + dadosTipo.name, Object.fromEntries(dados))
         .then(response => {
            nomesTipos = [];
            dadosTipo = null;

            const updateArea = document.getElementById('update-area');
            updateArea.classList.add('opacity-20');
            const elementos = updateArea.elements;

            for (let i = 0; i < elementos.length; i++) {
               elementos[i].disabled = true;
            }

            mensagemResultado.value = 'Tipo atualizado!';
            corMensagem.value = 'text-green-500';
         })
         .catch(error => {
            mensagemResultado.value = error.data;
            corMensagem.value = 'text-red-600';
         });
   } else {
      mensagemResultado.value = 'Nenhuma alteração feita!';
      corMensagem.value = 'text-red-600';
   }
}

function showConfirmarDelecao() {
   mostrarDeletar.value = true;
}

function fecharConfirmarDelecao() {
   mostrarDeletar.value = false;
}

function deletar() {
   axios.delete(backendURL + '/product-types/' + dadosTipo.name)
      .then(response => {
         nomesTipos = [];
         dadosTipo = null;
         nome.value = null;
         categoria.value = null;
         fatorEstoque.value = null;

         const updateArea = document.getElementById('update-area');
         updateArea.classList.add('opacity-20');
         const elementos = updateArea.elements;

         for (let i = 0; i < elementos.length; i++) {
            elementos[i].disabled = true;
         }

         fecharConfirmarDelecao();

         mensagemResultado.value = 'Tipo deletado!';
         corMensagem.value = 'text-green-500';
      })
      .catch(error => {
         mensagemResultado.value = error.data;
         corMensagem.value = 'text-red-600';
      });
}
</script>

<template>
   <div class="w-full flex flex-col items-center sm:border-x-2 border-orange-400">
      <h2 class="text-lg w-40 text-center text-orange-800 font-bold border-y-2 border-orange-400">Registrar Tipo</h2>

      <form @submit.prevent="realizarBuscaTipo" class="pt-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2" autocomplete="off">
         <div :class="[mostrarTipos ? 'relative':'']">
            <input type="text" id="tipo-produto" v-model="busca" @focus="buscarTipos" class="w-52 h-8 border-2 border-orange-600" placeholder="Insira a busca"></input>

            <div v-if="mostrarTipos" class="absolute w-52 max-h-44 overflow-y-auto top-full bg-orange-700 bg-opacity-80 text-white">
               <ul>
                  <li v-for="tipo in tiposFiltrados" :key="tipo" :id="tipo">
                     <button type="button" @click="tipoSelecionado(tipo)" class="w-full hover:bg-orange-800">{{ tipo }}</button>
                  </li>
               </ul>
            </div>
         </div>

         <div class="h-8 w-20 flex items-center justify-center">
            <button type="submit" class="h-7 w-16 bg-orange-700 hover:h-8 hover:w-20 duration-200 rounded-lg text-center text-white font-bold">Buscar</button>
         </div>
      </form>

      <div class="h-0.5 w-96 bg-orange-400 mt-8 mb-2"></div>

      <form @submit.prevent="enviarFormulario" id="update-area" class="mt-8 space-y-2 opacity-20" autocomplete="off">
         <div>
            <label for="nome" class="text-orange-600 font-bold">Nome: </label>
            <input type="text" id="nome" v-model="nome" class="w-52 border-2 border-orange-400" disabled="true"></input>
         </div>

         <div>
            <label for="categorias" class="text-orange-600 font-bold">Categoria: </label>
            <select id="categorias" v-model="categoria" class="bg-orange-600 border-2 border-orange-400 rounded-md h-7 text-white" disabled="true">
               <option value="PANIFICAÇÃO">Panificação</option>
               <option value="BOBONS_E_SALGADINHOS">Bobons e Salgadinhos</option>
               <option value="BEBIDAS_E_LATICÍNIOS">Bebidas e Laticínios</option>
               <option value="ALIMENTOS_REVENDA">Alimentos revenda</option>
               <option value="LIMPEZA_E_HIGIENE">Limpeza e Higiene</option>
               <option value="MATÉRIA_PRIMA">Matéria prima</option>
               <option value="OUTROS">Outros</option>
            </select>
         </div>

         <div>
            <label for="fatorEstoque" class="text-orange-600 font-bold">Fator Estoque Cheio: </label>
            <select id="fatorEstoque" v-model="fatorEstoque" class="bg-orange-600 border-2 border-orange-400 rounded-md h-7 w-12 text-center text-white" disabled="true">
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
            </select>
         </div>

         <div class="h-full"></div>

         <div class="flex">
            <button type="button" id="bt-restaurar" disabled="true" @click="restaurar" class="h-7 w-7 mr-32 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">
               <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/>
               </svg>
            </button>
         
            <button type="button" disabled="true" @click="showConfirmarDelecao" class="h-7 w-20 mx-2 bg-red-500 border-2 border-red-600 hover:bg-red-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Deletar</button>
            
            <button type="submit" disabled="true" class="h-7 w-20 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Salvar</button>
         </div>
      </form>

      <div class="my-8 w-4/5 text-center text-lg break-words" :class="corMensagem">{{ mensagemResultado }}</div>
   </div>

   <DeletarRegistroComp v-if="mostrarDeletar" @fechar="fecharConfirmarDelecao" @deletarRegistro="deletar"
      labelText="Tem certeza que deseja deletar esse registro? Produtos relacionados a ele serão deletados também."/>

   <div class="h-1 w-full bg-orange-600 my-10"></div>
</template>