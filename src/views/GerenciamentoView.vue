<script setup>
import BotaoOptionView from '/src/components/BotaoOptionView.vue'
import RegistrarTipoView from '../components/RegistrarTipoView.vue';
import RegistrarProdutoView from '../components/RegistrarProdutoView.vue';
import AtualizarTipoComp from '../components/AtualizarTipoComp.vue';
import AtualizarProdutoComp from '../components/AtualizarProdutoComp.vue';
import { ref } from 'vue';

const mostrarRegistrarProduto = ref(true);

function exibirOption(optionId) {
   if (optionId === 'r-produto') {
      mostrarRegistrarProduto.value = true;
   } else {
      mostrarRegistrarProduto.value = false;
   }

   const options = document.getElementsByClassName("option");
   for (let index = 0; index < options.length; index++) {
      options.item(index).classList.add("hidden");
   }
   
   document.getElementById(optionId).classList.remove("hidden");
}
</script>

<template>
   <h2 class="my-5 text-lg text-orange-950">Escolha uma opção abaixo</h2>

   <div>
      <div class="flex flex-col md:flex-row w-fit h-fit">
         <BotaoOptionView @clique="exibirOption" buttonText="Registrar Tipo" optionId="r-tipo"
               class="h-7 w-48 mr-1 mb-1 border-2 border-orange-500 bg-orange-400 hover:bg-orange-500 hover:border-orange-600 duration-100 text-orange-950 rounded-md"/>
         <BotaoOptionView @clique="exibirOption" buttonText="Registrar Produto" optionId="r-produto"
               class="h-7 w-48 mr-1 mb-1 border-2 border-orange-500 bg-orange-400 hover:bg-orange-500 hover:border-orange-600 duration-100 text-orange-950 rounded-md"/>
      </div>
      <div class="flex flex-col md:flex-row w-fit h-fit">
         <BotaoOptionView @clique="exibirOption" buttonText="Atualizar Tipo" optionId="a-tipo"
               class="h-7 w-48 mr-1 mb-1 border-2 border-orange-500 bg-orange-400 hover:bg-orange-500 hover:border-orange-600 duration-100 text-orange-950 rounded-md"/>
         <BotaoOptionView @clique="exibirOption" buttonText="Atualizar Produto" optionId="a-produto"
               class="h-7 w-48 mr-1 mb-1 border-2 border-orange-500 bg-orange-400 hover:bg-orange-500 hover:border-orange-600 duration-100 text-orange-950 rounded-md"/>
      </div>
   </div>

   <div class="h-1 w-4/5 bg-orange-600 my-10"></div>

   <div id="r-tipo" class="option w-4/5 hidden">
      <RegistrarTipoView />
   </div>
   <div id="r-produto" class="option w-4/5 hidden">
      <RegistrarProdutoView v-if="mostrarRegistrarProduto"/>
   </div>
   <div id="a-tipo" class="option w-4/5 hidden">
      <AtualizarTipoComp />
   </div>
   <div id="a-produto" class="option w-4/5 hidden">
      <AtualizarProdutoComp />
   </div>
</template>