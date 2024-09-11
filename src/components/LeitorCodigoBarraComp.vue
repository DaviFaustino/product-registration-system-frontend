<script setup>
import { ref } from 'vue';
import Quagga from 'quagga';

const mostrarLeitor = ref(false);
let contadorCodigoCorreto = 0;
let codigoAnterior = '';

const emit = defineEmits(['lido'])

function initLeitorCodigo() {
   mostrarLeitor.value = true;

   Quagga.init({
      inputStream: {
         name: "Live",
         type: "LiveStream",
         target: document.querySelector('#leitor')
      },
      decoder: {
         readers: ["ean_reader"]
      }
   }, function (err) {
      if (err) {
         console.log(err);
         return
      }
      Quagga.start();
      Quagga.onDetected((data) => {

         if (codigoAnterior === data.codeResult.code) {
            contadorCodigoCorreto++;
         } else {
            contadorCodigoCorreto = 0;
            codigoAnterior = data.codeResult.code;
         }

         if (contadorCodigoCorreto >= 15) {
            contadorCodigoCorreto = 0;
            codigoAnterior = '';

            atualizarCodigo(data);
         }
      });
   });
}

function atualizarCodigo(data) {
   Quagga.stop();
   mostrarLeitor.value = false;
   
   if (data) {
      emit('lido', data.codeResult.code);
   }
}

</script>

<template>
   <button type="button" @click="initLeitorCodigo()" class="h-8 w-10 bg-white border-2 border-orange-700 rounded-md">
      <svg class="h-7 w-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
         <path d="M24 32C10.7 32 0 42.7 0 56V456c0 13.3 10.7 24 24 24H40c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H24zm88 0c-8.8 0-16 7.2-16 16V464c0 8.8 7.2 16 16 16s16-7.2 16-16V48c0-8.8-7.2-16-16-16zm72 0c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H184zm96 0c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H280zM448 56V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H472c-13.3 0-24 10.7-24 24zm-64-8V464c0 8.8 7.2 16 16 16s16-7.2 16-16V48c0-8.8-7.2-16-16-16s-16 7.2-16 16z"/>
      </svg>
   </button>

   <div v-show="mostrarLeitor" class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
      <div id="leitor" class="h-4/5"></div>

      <button type="button" @click="atualizarCodigo()" class="h-8 w-20 bg-red-600 duration-200 rounded-lg text-center text-white font-bold">cancelar</button>
   </div>
</template>