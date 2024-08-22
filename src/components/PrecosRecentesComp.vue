<script setup>
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';

const verPrecosRecentes = ref(false);
const listaPrecosRecentes = reactive([]);
const precosRecentes = reactive([
   {
      nome: '',
      precoVenda: '',
      precoVendaAnterior: '',
   },
   {
      nome: '',
      precoVenda: '',
      precoVendaAnterior: '',
   },
   {
      nome: '',
      precoVenda: '',
      precoVendaAnterior: '',
   },
   {
      nome: '',
      precoVenda: '',
      precoVendaAnterior: '',
   }
]);

let quantGruposPrecos;
let iGrupoPrecos = 0;
const backendURL = import.meta.env.VITE_BACKEND_URL;

function buscarPrecosRecentes() {

   axios.get(backendURL + '/v1/products/recent-price-updates?initialTime=' + (Date.now() - 1209600000).toString())
      .then(response => {
         listaPrecosRecentes.value = response.data;

         if (listaPrecosRecentes.value.length != 0) {
            verPrecosRecentes.value = true;
            automatizarMudancaPrecosRecentes();
         }
      })
      .catch(error => {
         console.log(error.response.data.message);
      });
}

async function automatizarMudancaPrecosRecentes() {

   quantGruposPrecos = Math.ceil(listaPrecosRecentes.value.length / 4);
   while (iGrupoPrecos < quantGruposPrecos) {
      inserirValoresPrecosRecentes(iGrupoPrecos);
      await delay(5000)

      iGrupoPrecos++;
      if (iGrupoPrecos === quantGruposPrecos) {
         iGrupoPrecos = 0;
      }
   }
}

function inserirValoresPrecosRecentes(i) {
   for (let j = 0; j < 4; j++) {
      if (listaPrecosRecentes.value[j + (i * 4)]) {
         precosRecentes.at(j).nome = listaPrecosRecentes.value[j + (i * 4)].name;
         precosRecentes.at(j).precoVenda = listaPrecosRecentes.value[j + (i * 4)].salePriceInCents;
         precosRecentes.at(j).precoVendaAnterior = listaPrecosRecentes.value[j + (i * 4)].previousSalePriceInCents;
      } else {
         precosRecentes.at(j).nome = '';
         precosRecentes.at(j).precoVenda = '';
         precosRecentes.at(j).precoVendaAnterior = '';
      }
   }
}

function delay(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function mudarGrupoPrecosRecentes(paraDireita) {
   if (paraDireita) {
      iGrupoPrecos++;
      if (iGrupoPrecos === quantGruposPrecos) {
         iGrupoPrecos = 0;
      }
   } else {
      iGrupoPrecos--;
      if (iGrupoPrecos < 0) {
         iGrupoPrecos = quantGruposPrecos - 1;
      }
   }
   inserirValoresPrecosRecentes(iGrupoPrecos);
}

function editarValorRecente(posicao) {
   if (precosRecentes[posicao].precoVenda === '') {
      return '';
   }
   let valor = precosRecentes[posicao].precoVenda.toString();
   
   return valor.substring(0, valor.length - 2) + ',' + valor.substring(valor.length - 2);
}

onMounted(() => {
   buscarPrecosRecentes();
})
</script>

<template>
   <div v-if="verPrecosRecentes" class="flex flex-col  h-24 justify-center">
      <div class="flex flex-col sm:flex-row sm:space-x-4">
         <div class="flex w-52 md:w-64"
            :class="[precosRecentes[0].precoVenda > precosRecentes[0].precoVendaAnterior ? 'text-green-500' : 'text-red-600']">
            <span class="w-[13rem] break-words">{{ precosRecentes[0].nome }}</span>
            <span class="w-12 text-right"><strong>{{ editarValorRecente(0) }}</strong></span>
         </div>
         <div class="flex w-52 md:w-64"
            :class="[precosRecentes[1].precoVenda > precosRecentes[1].precoVendaAnterior ? 'text-green-500' : 'text-red-600']">
            <span class="w-[13rem] break-words">{{ precosRecentes[1].nome }}</span>
            <span class="w-12 text-right"><strong>{{ editarValorRecente(1) }}</strong></span>
         </div>
      </div>
      <div class="flex flex-col sm:flex-row sm:space-x-4">
         <div class="flex w-52 md:w-64"
            :class="[precosRecentes[2].precoVenda > precosRecentes[2].precoVendaAnterior ? 'text-green-500' : 'text-red-600']">
            <span class="w-[13rem] break-words">{{ precosRecentes[2].nome }}</span>
            <span class="w-12 text-right"><strong>{{ editarValorRecente(2) }}</strong></span>
         </div>
         <div class="flex w-52 md:w-64"
            :class="[precosRecentes[3].precoVenda > precosRecentes[3].precoVendaAnterior ? 'text-green-500' : 'text-red-600']">
            <span class="w-[13rem] break-words">{{ precosRecentes[3].nome }}</span>
            <span class="w-12 text-right"><strong>{{ editarValorRecente(3) }}</strong></span>
         </div>
      </div>
   </div>

   <div v-if="verPrecosRecentes" class="w-fit pt-4 space-x-1">
      <button @click="mudarGrupoPrecosRecentes(false)" class="h-8 w-8 sm:h-6 sm:w-6 bg-orange-400 hover:bg-orange-500 duration-100 text-white"><</button>
      <button @click="mudarGrupoPrecosRecentes(true)" class="h-8 w-8 sm:h-6 sm:w-6 bg-orange-400 hover:bg-orange-500 duration-100 text-white">></button>
   </div>
</template>