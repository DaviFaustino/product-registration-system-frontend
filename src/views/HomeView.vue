<script setup>
import BotaoOption from '../components/BotaoOptionComp.vue';
import BuscarTipoComp from '../components/BuscarTipoComp.vue';
import BuscarProdutoComp from '../components/BuscarProdutoComp.vue';
import PrecosRecentesComp from '../components/PrecosRecentesComp.vue';
import { ref } from 'vue';

const bProdutoAtivo = ref(true);

function exibirOption(optionId) {
   if ((optionId === 'busca-tipo' & bProdutoAtivo.value === false) || (optionId === 'busca-produto' & bProdutoAtivo.value === true)) {
      return;
   }

   bProdutoAtivo.value = !bProdutoAtivo.value;
}

</script>

<template>
   <h2 class="my-5 text-lg md:text-2xl text-orange-950">Bem-vindo ao sistema de registros do <br><strong>Point do
         Lanche</strong></h2>

   <PrecosRecentesComp />

   <div class="h-1 w-4/5 bg-orange-600 my-10"></div>

   <div class="mb-5 border-2 border-orange-700">
      <BotaoOption @clique="exibirOption" buttonText="Buscar por Produto" optionId="busca-produto" class="h-7 w-40 sm:w-48" :class="[ bProdutoAtivo ? 'bg-orange-700 text-white' : 'bg-orange-400 text-orange-950' ]"/>
      <BotaoOption @clique="exibirOption" buttonText="Buscar por Tipo" optionId="busca-tipo" class="h-7 w-40 sm:w-48" :class="[ bProdutoAtivo ? 'bg-orange-400 text-orange-950' : 'bg-orange-700 text-white' ]"/>
   </div>

   <div>
      <div v-if="bProdutoAtivo" id="busca-tipo" class="flex flex-col items-center">
         <BuscarTipoComp />
      </div>

      <div v-if="!bProdutoAtivo" id="busca-produto" class="flex flex-col items-center">
         <BuscarProdutoComp />
      </div>
   </div>
</template>