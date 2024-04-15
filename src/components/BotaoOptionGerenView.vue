<template>
    <button @click="cliqueBotao" class="h-7 w-48 mr-1 mb-1 bg-orange-200 hover:bg-orange-300 duration-100 rounded-md">
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