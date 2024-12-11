<template>
  <div class="mt-5 ml-5"> 
    oops, not found
    <router-link :to="`/`">Go to main page</router-link>
  </div>
</template>

<script>
  export default {
    created() {
      this.$router.push('/')
    }
  }
</script>