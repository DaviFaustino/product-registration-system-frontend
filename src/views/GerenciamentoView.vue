<script setup>
import BotaoGeren1View from '/src/components/BotaoGeren1View.vue'
</script>

<template>
    <h1 class="my-5">Escolha uma opção abaixo</h1>

    <div>
        <div class="flex flex-col md:flex-row w-fit h-fit">
            <BotaoGeren1View buttonText="Registrar Tipo"/>
            <BotaoGeren1View buttonText="Registrar Produto"/>
        </div>
        <div class="flex flex-col md:flex-row w-fit h-fit">
            <BotaoGeren1View buttonText="Atualizar Tipo"/>
            <BotaoGeren1View buttonText="Atualizar Produto"/>
        </div>
        <div class="flex flex-col md:flex-row w-fit h-fit">
            <BotaoGeren1View buttonText="Deletar Tipo"/>
            <BotaoGeren1View buttonText="Deletar Produto"/>
        </div>
    </div>

    <div class="h-1 w-4/5 bg-orange-600 my-10"></div>

    
</template>

