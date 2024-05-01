<template>
    <button @click="cliqueBotao">
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