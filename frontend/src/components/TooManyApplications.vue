<template>
    <div class="text-center pa-4">
      <v-dialog
        class="z-2000"
        v-model="warningDialog"
        max-width="400"
        persistent
      >
        <v-card
          prepend-icon="mdi-alert-octagon"
          text="You can only create 1 application per hour."
          title="Too many applications in 1 hour"
        >
          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeWarning">
              Close
            </v-btn>
            <v-btn @click="openApplications">
              View my applications
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  export default {
    props: {
      modelValue: Boolean,
    },
    emits: ['update:modelValue'],
    computed: {
      warningDialog: {
        get() {
          return this.modelValue
        },
        set(warningDialog) {
          this.$emit('update:modelValue', warningDialog)
        }
    }
    },
    methods: {
      closeWarning () {
        this.$emit('update:modelValue', false)
        this.$emit('closeApplicationDialog', true)
      },
      openApplications() {
        this.$emit('update:modelValue', false)
        this.$emit('closeApplicationDialog', true)
        this.$emit('openApplications', true)
      }
    }
  }
</script>

<style scoped>
  .z-2000 {
    z-index: 2000;
  }
</style>
