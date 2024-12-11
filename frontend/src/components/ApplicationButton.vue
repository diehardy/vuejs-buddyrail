<template>
  <v-btn color="green-darken-3" @click="invokeDialog">{{ message }}</v-btn>
</template>


<script>
  export default {
    methods: {
      invokeDialog() {
        this.$emit('invokeDialog', true)
      }
    },
    props :{
      message: String
    }
  }
</script>