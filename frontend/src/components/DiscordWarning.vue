<template>
  <div class="text-center pa-4">
    <v-dialog class="z-2000"
      v-model="discordDialog"
      max-width="400"
      persistent
    >
      <v-card
        prepend-icon="mdi-account-key"
        text="Authorize with Discord to create or view protected applications.."
        title="Authorizing with discord"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="closeDiscord">
            Close
          </v-btn>
          <a href="/api/discord/auth/redirect">
            <v-btn>
              Authorize
            </v-btn>
          </a>
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
        discordDialog: {
        get() {
          return this.modelValue
        },
        set(discordDialog) {
          this.$emit('update:modelValue', discordDialog)
        }
      }
      },
      methods: {
        closeDiscord () { 
          this.$emit('update:modelValue', false)
          this.$emit('closeApplicationDialog', true)
        }
      }
  }
</script>

<style>
  .z-2000{
    z-index: 2000;
  }
</style>