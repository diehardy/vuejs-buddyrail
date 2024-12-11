<template>
  <v-snackbar
    class="pa-5"
    v-model="computedSnackbarDialog"
    :timeout="2000"
    :color="snackbarColor"
    elevation="24"
  >
    <slot/>
  </v-snackbar>
</template>

<script>
  export default {
    data() {
      return {
        snackbarDialog: false,
      }
    },
    props: {
      modelValue: Boolean,
      type: String,
    },
    emits: ['update:modelValue'],
    computed: {
      computedSnackbarDialog: {
        get() {
          return this.modelValue
        },
        set(computedSnackbarDialog) {
          this.$emit('update:modelValue', computedSnackbarDialog)
        }
      },
      snackbarColor() {
        switch (this.type) {
          case 'success':
            return 'green-accent-3';
          case 'warning':
            return 'amber-darken-3';
          default:
            return 'grey';
        }
      }
    },
  }
</script>