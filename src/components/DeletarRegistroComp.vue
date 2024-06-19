<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
      <div class="flex flex-col justify-center items-center w-[28rem] h-32 bg-white border-2 border-orange-300 rounded-xl space-y-4">
         <label for="" class="text-orange-900">Tem certeza que deseja deletar esse registro?<br>Produtos relacionados a ele serão deletados também.</label>

         <div class="flex justify-center space-x-8">
            <button type="button" @click="$emit('fechar')" class="h-7 w-20 bg-orange-300 border-2 border-orange-400 rounded-lg text-orange-900">Cancelar</button>
            <button type="button" @click="$emit('deletarRegistro')" class="h-7 w-20 bg-red-500 border-2 border-red-600 rounded-lg text-white">Deletar</button>
         </div>
      </div>
   </div>
</template>