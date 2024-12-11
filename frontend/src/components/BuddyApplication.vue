<template>
  <div>
    <v-dialog 
      type="text"
      v-model="isDialog"
      transition="scroll-x-transition"
      width="auto"
    >
      <v-card
        max-width="600"
        prepend-icon="mdi-information-variant-box"
        :title="`Application of ${buddyNickname}`">
        <v-form>
          <v-container>

            <v-img
            class="rounded-xl	w-25 mx-auto"
            :src="`https://cdn.discordapp.com/avatars/${buddyInfo.id_discord}/${buddyInfo.avatar}`"></v-img>

            <div>
              <span class="text-h6">Message:</span> {{ buddyInfo.message ? buddyInfo.message : 'empty' }}
            </div>

            <div>
              <span class="text-h6">Date of application:</span> {{ dateFormatted }}
            </div>

            <div>
                <span class="text-h6 mr-3 d-inline">Preferred languages:</span>
                <v-chip-group>
                  <v-chip v-for="(language, index) in buddyInfo.languages" :key="index">{{language.language_name}}</v-chip>
                </v-chip-group>
            </div>

            <div>
              <span class="text-h6 mr-3 d-inline">Preferred videogames:</span>
              <v-chip-group>
                <v-chip v-for="(game, index) in buddyInfo.games" :key="index">{{game.name_game}}</v-chip>
              </v-chip-group>
            </div>

            <div>
              <span class="text-h6 mr-3 d-inline">Microphone:</span>
              {{ buddyInfo.is_mic ? 'Has microphone' : 'No microphone' }}
            </div>

            <div>
              <span class="text-h6 mr-3 d-inline">Microphone preference:</span>
              {{ preferredMicrophone }}
            </div>

            <div>
              <v-chip class="pa-5 ma-2" @click="copyNickname(buddyNickname)" 
              :class="{'bg-green-lighten-1': isCopied}"
              >
                {{ isCopied ? 'Nickname has been copied!' : 'Click to copy nickname' }}
              </v-chip>
            </div>


            <div>
              <v-btn
                color="red"
                variant="tonal"
                class="ms-auto mr-5 mt-5"
                text="Close"
                @click="isDialog = false"
              />

              <a
              target="blank"
              class="text-decoration-none	text-white"
              :href="`https://discord.com/channels/@me`">
                <v-btn color="#7289da" class="ms-auto mr-5 mt-5">Contact</v-btn>
              </a>
              
            </div>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
    data(){
      return {
        isCopied: false,
      }
    },
    props: {
      modelValue: Boolean,
      buddyInfo: Object
    },
    emits: ['update:modelValue'],
    computed: {
      isDialog: {
        get() {
          return this.modelValue
        },
        set(isDialog) {
          this.$emit('update:modelValue', isDialog)
        }
      },
      dateFormatted() {
        return new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date(this.buddyInfo.date_created));
      },
      buddyNickname() {
        return this.buddyInfo.username.charAt(0).toUpperCase() + this.buddyInfo.username.slice(1);
      },
      preferredMicrophone() {
        switch (this.buddyInfo.is_buddy_mic) {
          case 'Has microphone':
            return 'Prefers to play with buddy who has a mic'
          case 'No microphone':
            return 'Prefers to play with buddy who does not have a mic'
          case 'Both':
            return `The buddy's mic status does not matter`
          default:
            return 'Not chosen'
        }
      }
    },
    methods: {
      copyNickname(nickname) {
        this.isCopied = true;
        navigator.clipboard.writeText(nickname);
        setTimeout(()=> {
          this.isCopied = false
        }, 2500)
      }
    }
}
</script>