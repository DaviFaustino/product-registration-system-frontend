<script setup>
import BotaoOption from '../components/BotaoOptionView.vue';
import { ref } from 'vue';

const bProdutoAtivo = ref(true);

function exibirOption(optionId) {
   if ((optionId === 'busca-tipo' & bProdutoAtivo.value === false) || (optionId === 'busca-produto' & bProdutoAtivo.value === true)) {
      return;
   }

   const options = document.getElementsByClassName("option");
   for (let index = 0; index < options.length; index++) {
         options.item(index).classList.add("hidden");
   }
   
   document.getElementById(optionId).classList.remove("hidden");

   bProdutoAtivo.value = !bProdutoAtivo.value;
}

</script>

<template>
   <h2 class="my-5 text-lg md:text-2xl text-orange-950">Bem-vindo ao sistema de registros do <br><strong>Point do
         Lanche</strong></h2>

   <div class="h-1 w-4/5 bg-orange-600 my-10"></div>

   <div class="mb-5 border-2 border-orange-700">
      <BotaoOption @clique="exibirOption" buttonText="Buscar por Produto" optionId="busca-produto" :class="[ bProdutoAtivo ? 'botao-op-sel' : 'botao-op' ]"/>
      <BotaoOption @clique="exibirOption" buttonText="Buscar por Tipo" optionId="busca-tipo" :class="[ bProdutoAtivo ? 'botao-op' : 'botao-op-sel' ]"/>
   </div>

   <div>
      <div id="busca-tipo" class="option hidden">
      </div>

      <div id="busca-produto" class="option"></div>
   </div>
</template>

<style scoped>
.botao-op {
   @apply h-7 w-48 bg-orange-400 text-orange-950;
}

.botao-op-sel {
   @apply h-7 w-48 bg-orange-700 text-white;
}
</style>