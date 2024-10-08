<script setup>
import axios from 'axios';
import { computed, reactive, ref } from 'vue';
import LeitorCodigoBarraComp from './LeitorCodigoBarraComp.vue';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const codigo = ref('');
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
const habilitarMostrarRestricoes = ref(false);

const mostrarRestricaoTamanhoCodigo = computed(() => {
   return (habilitarMostrarRestricoes.value && (codigo.value.length < 4 || codigo.value.length > 13) && codigo.value.length > 0) ? true : false;
});

const mostrarRestricaoConteudoCodigo = computed(() => {
   return habilitarMostrarRestricoes.value && codigo.value.match(/[^0-9]/g) ? true : false;
});

const mostrarRestricaoTamanhoTipoProduto = computed(() => {
   return habilitarMostrarRestricoes.value && (tipoProduto.nome.length < 3 || tipoProduto.nome.length > 32) ? true : false;
});

const mostrarRestricaoTamanhoNome = computed(() => {
   return (habilitarMostrarRestricoes.value && (nome.value.length < 3 || nome.value.length > 42)) ? true : false;
});

const mostrarRestricaoTamanhoDescricao = computed(() => {
   return (habilitarMostrarRestricoes.value && (descricao.value.length > 256)) ? true : false;
});

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

async function atualizarMostrarTipos() {
   await new Promise(resolve => setTimeout(resolve, 100));
   tipoProduto.nome += ' ';
   tipoProduto.nome = tipoProduto.nome.slice(0, -1);
}

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
   habilitarMostrarRestricoes.value = true;
   if (mostrarRestricaoTamanhoCodigo.value || mostrarRestricaoConteudoCodigo.value || mostrarRestricaoTamanhoTipoProduto.value ||
      mostrarRestricaoTamanhoNome.value || mostrarRestricaoTamanhoDescricao.value) {
      return;
   }

   const dados = {
      code: codigo.value.length === 0 ? null: codigo.value,
      productTypeName: tipoProduto.nome,
      name: nome.value,
      description: descricao.value,
      purchasePriceInCents: parseInt(precos[0].replace(',', ''), 10),
      salePriceInCents: parseInt(precos[1].replace(',', ''), 10),
      fullStock: estoqueCheio.value
   }

   axios.post(backendURL + '/v1/products?' + 'isPriceOld=' + precoAntigo.value, dados)
      .then(response => {
         
         codigo.value = '';
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

         habilitarMostrarRestricoes.value = false;
      })
      .catch(error => {
         mensagemResultado.value = error.response.data.message;
         corMensagem.value = 'text-red-600';
      })
}
</script>

<template>
   <div class="w-full flex flex-col items-center sm:border-x-2 border-orange-400">
      <h2 class="text-lg w-40 text-center text-orange-800 font-bold border-y-2 border-orange-400">Registrar Produto</h2>

      <form @submit.prevent="enviarFormulario" class="mt-8 space-y-2" autocomplete="off">
         <div class="flex flex-col">
            <div id="area-codigo" class="flex items-center space-x-1">
               <label for="codigo" class="text-orange-600 font-bold">Código: </label>
               <input type="text" id="codigo" v-model="codigo" class="w-52 border-2 border-orange-400"></input>
               
               <LeitorCodigoBarraComp @lido="atualizarCodigo"/>
            </div>

            <label for="area-codigo" v-if="mostrarRestricaoTamanhoCodigo" class="text-sm text-red-500">*o código precisa ter entre 4 e 13 dígitos ou deixe vazio</label>
            <label for="area-codigo" v-if="mostrarRestricaoConteudoCodigo" class="text-sm text-red-500">*o código precisa ter apenas números</label>
         </div>

         <div>
            <div id="area-tipo-produto" class="flex space-x-1">
               <label for="tipo-produto" class="text-orange-600 font-bold">Tipo de produto:</label>
   
               <div :class="[mostrarTipos ? 'relative':'']">
                  <!-- O código de focusout força a atualização de mostrarTipos -->
                  <input type="text" id="tipo-produto" v-model="tipoProduto.nome" @focus="buscarTipos" @focusout="atualizarMostrarTipos"
                        class="w-[11.4rem] sm:w-52 border-2 border-orange-400"></input>
   
                  <div v-if="mostrarTipos" class="absolute w-52 max-h-44 overflow-y-auto top-full bg-orange-700 bg-opacity-80 text-white">
                     <ul>
                        <li v-for="tipo in tiposFiltrados" :key="tipo" :id="tipo">
                           <button type="button" @click="tipoSelecionado(tipo)" class="w-full hover:bg-orange-800">{{ tipo }}</button>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            <label for="area-tipo-produto" v-if="mostrarRestricaoTamanhoTipoProduto" class="text-sm text-red-500">*o nome do tipo de produto precisa ter entre 3 e 32 caracteres</label>
         </div>

         <div>
            <div id="area-nome">
               <label for="nome" class="text-orange-600 font-bold">Nome: </label>
               <input type="text" id="nome" v-model="nome" class="w-[16.2rem] sm:w-[17.9rem] border-2 border-orange-400"></input>
            </div>

            <label for="area-nome" v-if="mostrarRestricaoTamanhoNome" class="text-sm text-red-500">*o nome do produto precisa ter entre 3 e 42 caracteres</label>
         </div>

         <div>
            <div id="area-descricao" class="flex flex-col">
               <label for="descricao" class="text-orange-600 font-bold">Descrição </label>
               <textarea id="descricao" cols="30" rows="4" v-model="descricao"
                  class="w-[19.5rem] sm:w-[21.2rem] border-2 border-orange-400"></textarea>
            </div>

            <label for="area-descricao" v-if="mostrarRestricaoTamanhoDescricao" class="text-sm text-red-500">*a descrição pode ter no máximo 256 caracteres</label>
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