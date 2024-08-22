<script setup>
import axios from 'axios';
import { ref, reactive, computed } from 'vue';
import LeitorCodigoBarraView from './LeitorCodigoBarraView.vue';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const codigo = ref(null);
const tipoProduto = reactive({ nome: '' });
const nome = ref('');
const descricao = ref('');
let precos = reactive(['0,00', '0,00']);
const tamanhoStringPrecosAnteriores = reactive([3, 3]);
const precoAntigo = ref('true');
const estoqueCheio = ref('true');

let nomesTipos = [];

let camposPreco = null;
let quantDigitosCompraVenda = [0, 0];

const mensagemResultado = ref('');
const corMensagem = ref('');

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
      camposPreco = [document.getElementById('preco-compra'), document.getElementById('preco-venda')];
   }

   let posicaoFinal = precos[id].length;
   camposPreco[id].setSelectionRange(posicaoFinal, posicaoFinal);
}

function editarCamposPreco(id) {
   if(precos[id].match(/[^0-9]$/g) !== null) {
      precos[id] = precos[id].replace(/[^0-9]$/g, '');

      if (precos[id].length === 0) {
         reiniciarValoresPrecos(id);
      }
      return false;
   }

   precos[id] = precos[id].replace(',', '');
   
   if ((precos[id].match(/^[0]+$/g) || precos[id] === '')) {
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


function enviarFormulario() {
   const dados = {
      code: codigo.value,
      productTypeName: tipoProduto.nome,
      name: nome.value,
      description: descricao.value,
      purchasePriceInCents: parseInt(precos[0].replace(',', ''), 10),
      salePriceInCents: parseInt(precos[1].replace(',', ''), 10),
      fullStock: estoqueCheio.value
   }

   axios.post(backendURL + '/v1/products?' + 'isPriceOld=' + precoAntigo.value, dados)
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

         mensagemResultado.value = 'Produto salvo!';
         corMensagem.value = 'text-green-500';
      })
      .catch(error => {
         mensagemResultado.value = error.data;
         corMensagem.value = 'text-red-600';
      })
}
</script>

<template>
   <div class="w-full flex flex-col items-center sm:border-x-2 border-orange-400">
      <h2 class="text-lg w-40 text-center text-orange-800 font-bold border-y-2 border-orange-400">Registrar Produto</h2>

      <form @submit.prevent="enviarFormulario" class="mt-8 space-y-2" autocomplete="off">
         <div class="flex items-center space-x-1">
            <label for="codigo" class="text-orange-600 font-bold">Código: </label>
            <input type="text" id="codigo" v-model="codigo" class="w-52 border-2 border-orange-400"></input>
            
            <LeitorCodigoBarraView @lido="atualizarCodigo"/>
         </div>

         <div class="flex space-x-1">
            <label for="tipo-produto" class="text-orange-600 font-bold">Tipo de produto:</label>

            <div :class="[mostrarTipos ? 'relative':'']">
               <input type="text" id="tipo-produto" v-model="tipoProduto.nome" @focus="buscarTipos" class="w-52 border-2 border-orange-400"></input>

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
            <input type="text" id="nome" v-model="nome" class="w-52 border-2 border-orange-400"></input>
         </div>

         <div class="flex flex-col">
            <label for="descricao" class="text-orange-600 font-bold">Descrição </label>
            <textarea id="descricao" cols="30" rows="4" v-model="descricao"
               class="border-2 border-orange-400"></textarea>
         </div>

         <div>
            <label for="preco-compra" class="text-orange-600 font-bold">Preço de compra: </label>
            <input type="text" id="preco-compra" v-model="precos[0]" @click="posicionarCursor(0)" @input="editarCamposPreco(0)" class="w-32 border-2 border-orange-400 text-right"></input>
         </div>

         <div>
            <label for="preco-venda" class="text-orange-600 font-bold">Preço de venda: </label>
            <input type="text" id="preco-venda" v-model="precos[1]" @click="posicionarCursor(1)" @input="editarCamposPreco(1)" class="w-32 border-2 border-orange-400 text-right"></input>
         </div>

         <div>
            <label for="" class="text-orange-600 font-bold">O preço de venda é antigo? </label>
            <input type="radio" v-model="precoAntigo" value="true">Sim</input>
            <input type="radio" v-model="precoAntigo" value="false">Não</input>
         </div>

         <div>
            <label for="Estoque-abastecido" class="text-orange-600 font-bold">Há estoque do produto? </label>
            <input type="radio" v-model="estoqueCheio" value="true">Sim</input>
            <input type="radio" v-model="estoqueCheio" value="false">Não</input>
         </div>

         <div class="w-full flex justify-center">
            <button type="submit" class="h-7 w-20 bg-orange-500 border-2 border-orange-600 hover:bg-orange-600 duration-150 rounded-lg mt-5 text-center text-white font-bold">Salvar</button>
         </div>
      </form>

      <div class="my-8 w-4/5 text-center text-lg break-words" :class="corMensagem">{{ mensagemResultado }}</div>
   </div>

   <div class="h-1 w-full bg-orange-600 my-10"></div>
</template>