<template>
    <button @click="handleClick" class="h-7 w-48 mr-1 mb-1 bg-orange-200 hover:bg-orange-300 duration-100 rounded-md">
        {{ buttonText }}
    </button>
</template>

<script>
export default {
    props: {
        buttonText: {
            type: String,
            required: true
        }
    },
    methods: {
        handleClick() {
            // Aqui você pode adicionar qualquer lógica que deseja executar quando o botão é clicado
            console.log('Botão clicado!');
        }
    }
}
</script>