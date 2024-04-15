<template>
   <h1 class="my-5">Escolha uma opção abaixo</h1>

   <div>
      <div class="flex flex-col md:flex-row w-fit h-fit">
         <BotaoOptionGerenView @clique="exibirOption" buttonText="Registrar Tipo" optionId="r-tipo"/>
         <BotaoOptionGerenView @clique="exibirOption" buttonText="Registrar Produto" optionId="r-produto"/>
      </div>
      <div class="flex flex-col md:flex-row w-fit h-fit">
         <BotaoOptionGerenView @clique="exibirOption" buttonText="Atualizar Tipo" optionId="a-tipo"/>
         <BotaoOptionGerenView @clique="exibirOption" buttonText="Atualizar Produto" optionId="a-produto"/>
      </div>
      <div class="flex flex-col md:flex-row w-fit h-fit">
         <BotaoOptionGerenView @clique="exibirOption" buttonText="Deletar Tipo" optionId="d-tipo"/>
         <BotaoOptionGerenView @clique="exibirOption" buttonText="Deletar Produto" optionId="d-produto"/>
      </div>
   </div>

   <div class="h-1 w-4/5 bg-orange-600 my-10"></div>

   <div id="r-tipo" class="option hidden"></div>
   <div id="r-produto" class="option hidden"></div>
   <div id="a-tipo" class="option hidden"></div>
   <div id="a-produto" class="option hidden"></div>
   <div id="d-tipo" class="option hidden"></div>
   <div id="d-produto" class="option hidden"></div>
</template>

<script setup>
import BotaoOptionGerenView from '/src/components/BotaoOptionGerenView.vue'

function exibirOption(optionId) {
   const options = document.getElementsByClassName("option");
   for (let index = 0; index < options.length; index++) {
         options.item(index).classList.add("hidden");
   }
   document.getElementById(optionId).classList.remove("hidden");

   console.log(document.getElementById(optionId));
}
</script>