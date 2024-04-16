<template>
    <button @click="cliqueBotao" class="h-7 w-48 mr-1 mb-1 border-2 border-orange-400 bg-orange-300 hover:bg-orange-200 hover:border-orange-300 duration-100 text-orange-950 rounded-md">
        {{ buttonText }}
    </button>
</template>

<script setup>
const props = defineProps({
    buttonText: String,
    optionId: String
})

const emit = defineEmits(['clique'])

function cliqueBotao() {
    emit('clique', props.optionId)
}
</script>