<template>
    <button @click="emitirEvento" class="h-7 w-48 mr-1 mb-1 bg-orange-200 hover:bg-orange-300 duration-100 rounded-md">
        {{ buttonText }}
    </button>
</template>

<script>
export default {
    props: {
        buttonText: {
            type: String,
            required: true
        },
        optionId: {
            type: String,
            required: true
        }
    },
    methods: {
        emitirEvento() {
            this.$emit('clique', this.optionId);
        }
    }
}
</script>