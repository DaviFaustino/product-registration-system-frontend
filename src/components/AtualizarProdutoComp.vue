<script setup>
const props = defineProps({
    buscaProduto: String
})

import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import DeletarRegistroComp from './DeletarRegistroComp.vue';
import LeitorCodigoBarraComp from './LeitorCodigoBarraComp.vue';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const busca = ref('');
const mostrarLeitorAtualiBusca = ref(true);
const estaDesabilitado = ref(true);
let dadosProduto;

const codigo = ref(null);
const tipoProduto = reactive({ nome: '' });
const nome = ref('');
const descricao = ref('');
let precos = reactive(['0,00', '0,00']);
const estoqueCheio = ref('true');

let nomesTipos = [];

let camposPreco = null;
let quantDigitosCompraVenda = [0, 0];
const tamanhoStringPrecosAnteriores = reactive([3, 3]);

const mensagemResultado = ref('');
const corMensagem = ref('');

const mostrarDeletarRegistro = ref(false);

function funMostrarLeitorAtualiBusca(mostrar) {
   mostrarLeitorAtualiBusca.value = mostrar;
}

function atualizarBusca(novaBusca) {
   busca.value = novaBusca;
}

function mudarDesabilitado(valor) {
   estaDesabilitado.value = valor;
}

function realizarBuscaProduto() {
   axios.get(backendURL + '/v1/products?' + 'searchTerm=' + encodeURIComponent(busca.value))
      .then(response => {

         dadosProduto = response.data[0];
         dadosProduto.code = dadosProduto.code.replace(/\s+/g, '');
         codigo.value = dadosProduto.code;
         tipoProduto.nome = dadosProduto.productTypeName;
         nome.value = dadosProduto.name;
         descricao.value = dadosProduto.description;

         precos[0] = dadosProduto.purchasePriceInCents + '';
         precos[1] = dadosProduto.salePriceInCents + '';
         for (let i = 0; i < 2; i++) {
            quantDigitosCompraVenda[i] = precos[i].length;
            precos[i] = precos[i].padStart(3, '0');
            tamanhoStringPrecosAnteriores[i] = precos[i].length;
            precos[i] = precos[i].replace(precos[i], precos[i].substring(0, precos[i].length - 2) + ',' + precos[i].substring(precos[i].length - 2));
         }

         estoqueCheio.value = dadosProduto.fullStock ? 'true': 'false';         

         mudarDesabilitado(false);
         const updateAreaProduto = document.getElementById('update-area-produto');
         updateAreaProduto.classList.remove('opacity-20');
         const elementos = updateAreaProduto.elements;

         for (let i = 0; i < elementos.length; i++) {
            elementos[i].disabled = false;
         }

         mostrarLeitorAtualiBusca.value = false;
      })
      .catch(error => {
         mensagemResultado.value = error.response.data.message;
         corMensagem.value = 'text-red-600';
      });
}

function atualizarCodigo(novoCodigo) {
   codigo.value = novoCodigo;
}

function buscarTipos() {
   if (nomesTipos.length === 0) {
      axios.get(backendURL + '/v1/product-types/names')
         .then(response => {
            nomesTipos = response.data;
         })
         .catch(error => {
            console.error('Erro: ', error);
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

function posicionarCursor(id) {
   if (camposPreco === null) {
      camposPreco = [document.getElementById('preco-compra-atualizar'), document.getElementById('preco-venda-atualizar')];
   }

   let posicaoFinal = precos[id].length;
   camposPreco[id].setSelectionRange(posicaoFinal, posicaoFinal);
}

function editarCamposPreco(id) {
   if (precos[id].match(/[^0-9]$/g) !== null) {
      precos[id] = precos[id].replace(/[^0-9]$/g, '');

      if (precos[id].length === 0) {
         reiniciarValoresPrecos(id);
      }
      return false;
   }

   precos[id] = precos[id].replace(',', '');

   if (precos[id].match(/^[0]+$/g) || precos[id] === '') {
      reiniciarValoresPrecos(id);
      return false;
   }

   if (precos[id].length === 1) {
      precos[id] = precos[id].padStart(4, '0');
      quantDigitosCompraVenda[id] = 0;
      tamanhoStringPrecosAnteriores[id] = 0;
   }

   if (tamanhoStringPrecosAnteriores[id] < precos[id].length) {
      quantDigitosCompraVenda[id]++;
   } else {
      if (quantDigitosCompraVenda[id] > 0) {
         quantDigitosCompraVenda[id]--;
      }
   }

   if (quantDigitosCompraVenda[id] < 4) {
      if (precos[id].length > 3) {
         precos[id] = precos[id].slice(1, precos[id].length);
      } else {
         if (precos[id].length < 3) {
            precos[id] = '0' + precos[id];
         }
      }
   }

   tamanhoStringPrecosAnteriores[id] = precos[id].length;
   precos[id] = precos[id].replace(precos[id], precos[id].substring(0, precos[id].length - 2) + ',' + precos[id].substring(precos[id].length - 2));
}

function reiniciarValoresPrecos(id) {
   precos[id] = '0,00';
   quantDigitosCompraVenda[id] = 0;
   tamanhoStringPrecosAnteriores[id] = 3;
}

function restaurar() {
   if (!document.getElementById('bt-restaurar-produto').disabled) {
      codigo.value = dadosProduto.code;
      tipoProduto.nome = dadosProduto.productTypeName;
      nome.value = dadosProduto.name;
      descricao.value = dadosProduto.description;

      precos[0] = dadosProduto.purchasePriceInCents + '';
      precos[1] = dadosProduto.salePriceInCents + '';
      for (let i = 0; i < 2; i++) {
         quantDigitosCompraVenda[i] = precos[i].length;
         precos[i] = precos[i].padStart(3, '0');
         tamanhoStringPrecosAnteriores[i] = precos[i].length;
         precos[i] = precos[i].replace(precos[i], precos[i].substring(0, precos[i].length - 2) + ',' + precos[i].substring(precos[i].length - 2));
      }

      estoqueCheio.value = dadosProduto.fullStock ? 'true': 'false';
   }
}

function enviarFormulario() {
   let dados = [];

   if (dadosProduto !== null) {
      if (codigo.value !== dadosProduto.code) {
         dados.push(['code', codigo.value]);
      }
      if (tipoProduto.nome !== dadosProduto.productTypeName) {
         dados.push(['productTypeName', tipoProduto.nome]);
      }
      if (nome.value !== dadosProduto.name && nome.value !== '') {
         dados.push(['name', nome.value]);
      }
      if (descricao.value !== dadosProduto.description) {
         dados.push(['description', descricao.value]);
      }

      let precoCompraInt = parseInt(precos[0].replace(',', ''), 10);
      let precoVendaInt = parseInt(precos[1].replace(',', ''), 10);

      if (precoCompraInt !== dadosProduto.purchasePriceInCents && precoCompraInt !== 0) {
         dados.push(['purchasePriceInCents', precoCompraInt]);
      }
      if (precoVendaInt !== dadosProduto.salePriceInCents && precoVendaInt !== 0) {
         dados.push(['salePriceInCents', precoVendaInt]);
      }
      let cheio = estoqueCheio.value === 'true' ? true: false;
      if (cheio !== dadosProduto.fullStock) {
         dados.push(['fullStock', cheio]);
      }
   }

   if (dados.length !== 0) {
      axios.patch(backendURL + '/v1/products?' + 'code=' + dadosProduto.code, Object.fromEntries(dados))
         .then(response => {
            dadosProduto = null;

            const updateArea = document.getElementById('update-area-produto');
            updateArea.classList.add('opacity-20');

            const elementos = updateArea.elements;
            for (let i = 0; i < elementos.length; i++) {
               elementos[i].disabled = true;
            }
            mudarDesabilitado(true);

            mensagemResultado.value = 'Produto salvo!';
            corMensagem.value = 'text-green-500';
         })
         .catch(error => {
            mensagemResultado.value = error.response.data.message;
            corMensagem.value = 'text-red-600';
         });
   } else {
      mensagemResultado.value = 'Nenhuma alteração feita!';
      corMensagem.value = 'text-red-600';
   }
}

function alterarMostrarDeletarRegistro(value) {
   mostrarDeletarRegistro.value = value;
}

function deletar() {
   axios.delete(backendURL + '/v1/products?code=' + dadosProduto.code)
      .then(response => {

         codigo.value = null;
         tipoProduto.nome = '';
         nome.value = '';
         descricao.value = '';
         precos[0] = '0,00';
         precos[1] = '0,00';
         tamanhoStringPrecosAnteriores[0] = 3;
         tamanhoStringPrecosAnteriores[1] = 3;
         quantDigitosCompraVenda[0] = 0;
         quantDigitosCompraVenda[1] = 0;

         const updateArea = document.getElementById('update-area-produto');
         updateArea.classList.add('opacity-20');
         const elementos = updateArea.elements;

         for (let i = 0; i < elementos.length; i++) {
            elementos[i].disabled = true;
         }

         alterarMostrarDeletarRegistro(false);

         mensagemResultado.value = 'Tipo deletado!';
         corMensagem.value = 'text-green-500';
      })
      .catch(error => {
         mensagemResultado.value = error.response.data.message;
         corMensagem.value = 'text-red-600';
      });
}

onMounted(() => {
   busca.value = props.buscaProduto.replace(/\s+/g, '');
})
</script>

<template>
   <div class="w-full flex flex-col items-center sm:border-x-2 border-orange-400">
      <h2 class="text-lg w-40 text-center text-orange-800 font-bold border-y-2 border-orange-400">Atualizar Produto</h2>

      <form @submit.prevent="realizarBuscaProduto" class="pt-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2" autocomplete="off">
         <div class="flex space-x-1">
            <input type="text" id="busca-produto" v-model="busca" @click="funMostrarLeitorAtualiBusca(true)" class="w-64 h-8 border-2 border-orange-600"
               placeholder="Insira um código ou uma palavra"></input>

            <LeitorCodigoBarraComp v-if="mostrarLeitorAtualiBusca" @lido="atualizarBusca" />
         </div>

         <div class="h-8 w-20 flex items-center justify-center">
            <button type="submit" class="h-7 w-16 bg-orange-700 hover:h-8 hover:w-20 duration-200 rounded-lg text-center text-white font-bold">Buscar</button>
         </div>
      </form>

      <div class="h-0.5 w-full sm:w-96 bg-orange-400 mt-8 mb-2"></div>

      <form @submit.prevent="enviarFormulario" id="update-area-produto" class="mt-8 space-y-2 opacity-20" autocomplete="off">
         <div class="flex items-center space-x-1">
            <label for="codigo" class="text-orange-600 font-bold">Código: </label>
            <input type="text" id="codigo" v-model="codigo" @click="funMostrarLeitorAtualiBusca(false)" class="w-52 border-2 border-orange-400" disabled="true"></input>

            <div :class="{ desabilitado: estaDesabilitado }">
               <LeitorCodigoBarraComp v-if="!mostrarLeitorAtualiBusca" @lido="atualizarCodigo" />
            </div>
         </div>

         <div class="flex space-x-1">
            <label for="tipo-produto" class="text-orange-600 font-bold">Tipo de produto:</label>

            <div :class="[mostrarTipos ? 'relative' : '']">
               <input type="text" id="tipo-produto" v-model="tipoProduto.nome" @focus="buscarTipos" class="w-[11.4rem] sm:w-52 border-2 border-orange-400" disabled="true"></input>

               <div v-if="mostrarTipos" class="absolute w-52 max-h-44 overflow-y-auto top-full bg-orange-700 bg-opacity-80 text-white">
                  <ul>
                     <li v-for="tipo in tiposFiltrados" :key="tipo" :id="tipo">
                        <button type="button" @click="tipoSelecionado(tipo)" class="w-full hover:bg-orange-800">{{ tipo }}</button>
                     </li>
                  </ul>
               </div>
            </div>
         </div>

         <div>
            <label for="nome" class="text-orange-600 font-bold">Nome: </label>
            <input type="text" id="nome" v-model="nome" class="w-[16.2rem] sm:w-[17.9rem] border-2 border-orange-400" disabled="true"></input>
         </div>

         <div class="flex flex-col">
            <label for="descricao" class="text-orange-600 font-bold">Descrição </label>
            <textarea id="descricao" cols="30" rows="4" v-model="descricao" class="w-[19.5rem] sm:w-[21.2rem] border-2 border-orange-400" disabled="true"></textarea>
         </div>

         <div>
            <label for="preco-compra-atualizar" class="text-orange-600 font-bold">Preço de compra: </label>
            <input type="text" id="preco-compra-atualizar" disabled="true" v-model="precos[0]" @click="posicionarCursor(0)" @input="editarCamposPreco(0)"
               class="w-32 border-2 border-orange-400 text-right"></input>
         </div>

         <div>
            <label for="preco-venda-atualizar" class="text-orange-600 font-bold">Preço de venda: </label>
            <input type="text" id="preco-venda-atualizar" disabled="true" v-model="precos[1]" @click="posicionarCursor(1)" @input="editarCamposPreco(1)"
               class="w-32 border-2 border-orange-400 text-right"></input>
         </div>

         <div>
            <label for="Estoque-abastecido" class="text-orange-600 font-bold">Há estoque do produto? </label>
            <input type="radio" v-model="estoqueCheio" value="true" disabled="true">Sim</input>
            <input type="radio" v-model="estoqueCheio" value="false" disabled="true">Não</input>
         </div>

         <div class="flex">
            <button type="button" id="bt-restaurar-produto" disabled="true" @click="restaurar"
               class="h-7 w-7 mr-28 sm:mr-32 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">
               
               <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/>
               </svg>
            </button>

            <button type="button" disabled="true" @click="alterarMostrarDeletarRegistro(true)"
               class="h-7 w-20 mx-2 bg-red-500 border-2 border-red-600 hover:bg-red-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Deletar</button>
            
            <button type="submit" disabled="true"
               class="h-7 w-20 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Salvar</button>
         </div>
      </form>

      <div class="my-8 w-4/5 text-center text-lg break-words" :class="corMensagem">{{ mensagemResultado }}</div>
   </div>

   <DeletarRegistroComp v-if="mostrarDeletarRegistro" @fechar="alterarMostrarDeletarRegistro(false)" @deletarRegistro="deletar"
      labelText="Tem certeza que deseja deletar esse registro?"/>

   <div class="h-1 w-full bg-orange-600 my-10"></div>
</template>

<style>
.desabilitado {
   pointer-events: none;
}
</style>