<template>
  <div class="text-center mb-4">
    <ApplicationButton :message="'Apply'" @invokeDialog="invokeDialog"/>
    <v-dialog transition="scroll-x-transition"  style="z-index: 1;"
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="600"
        prepend-icon="mdi-progress-check"
        title="Making an application"
      >
        <v-form  @submit.prevent="saveApplication">
            <v-container>
              <v-row>
                  <v-col cols="12">
                      <v-autocomplete
                      autocomplete="off"
                      v-show="languages.length > 0"
                      chips
                      v-model="applicationData.chosenLanguages"
                      label="Languages you want to communicate in"
                      :items="languages"
                      item-title="language_name"
                      item-value="id_language"
                      multiple
                      variant="outlined"
                      ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                      <v-autocomplete v-show="games.length > 0"
                      autocomplete="off"
                      chips
                      v-model="applicationData.chosenGames"
                      label="Choose games you want to play"
                      :items="games"
                      item-title="name_game"
                      item-value="id_game"
                      multiple
                      variant="outlined"
                      ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      variant="outlined"
                      label="Does your buddy have a microphone?"
                      item-name="title"
                      item-value="value"
                      :items="microphoneAvailability"
                      v-model="applicationData.buddyMicrophone"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      autocomplete="off"
                      v-model="applicationData.message"
                      label="Message to your buddy"
                      required
                    ></v-text-field>
                    <span
                    :class="messageLimit > 200 ? 'text-red-accent-3' : ''">
                      {{ messageLimit }} / 200
                      {{ messageLimit > 200 ? 'Your message is too long!' : '' }}
                    </span>
                  </v-col>
                  <v-col cols="12" >
                    <v-switch class="ma-0 pa-0"
                    hide-details
                    label="Do you have a microphone?"
                    v-model="applicationData.isMic"
                    color="yellow"></v-switch>
                    <v-switch
                    hide-details class="ma-0 pa-0"
                    label="Does your buddy have to be authorize through discord to connect you?"
                    v-model="applicationData.isAuthorized"
                    color="yellow"></v-switch>
                  </v-col>
              </v-row>
              <div>
              <v-btn
                color="red"
                variant="tonal"
                class="ms-auto mr-5"
                text="Cancel"
                @click="dialog = false"
              ></v-btn>
              <v-btn
                color="green-darken-3"
                variant="tonal"
                class="ms-auto mr-2"
                text="Submit"
                type="submit"
              ></v-btn>
              </div>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
  import {httpServer} from '@/main'
  export default {
    data() {
      return {
        authorizeDialog: false,
        dialog: false,
        applicationData: {
          message: '',
          isMic: true,
          isAuthorized: false,
          chosenGames :[],
          chosenLanguages: [],
          buddyMicrophone: 'Has microphone'
        },
        lastLessThanHour: false,
        microphoneAvailability: [
          {title: `Doesn't matter`, value: 'Both'},
          {title: `No microphone`, value: 'No microphone'},
          {title: `Has microphone`, value: 'Has microphone'}
        ]
      }
    },
    props: {
      games: Array,
      languages: Array,
      isAuthorized: Boolean,
      isDiscordDialog: Boolean,
      isWarningDialog: Boolean,
    },
    methods: {
      checkLastApplication(){
        httpServer
          .get("/check-last-application")
          .then((response) => {
            this.lastLessThanHour = response.data;

            if(this.lastLessThanHour) {this.$emit('callWarning', true)}

          })
          .catch(() => {});
      },
      invokeDialog() {
        this.dialog = true;

        if(!this.isAuthorized) {
          this.$emit('callDiscord', true)
        }

        this.applicationData = {
          message: '',
          isMic: true,
          isAuthorized: false,
          chosenGames :[],
          chosenLanguages: [],
          buddyMicrophone: 'Has microphone',
        };
      },
      callSnackbar(message, type){
        this.$emit('callSnackbar', {message: message, type: type});
      },
      saveApplication() {
        if (this.applicationData.chosenLanguages.length == 0) {
          this.callSnackbar(`You have to choose at least 1 language.`, 'warning')
          return
        }

        if (this.applicationData.chosenLanguages.length > 3) {
          this.callSnackbar(`You can't choose more than 3 languages.`, 'warning')
          return
        }

        if (this.applicationData.chosenGames.length < 1) {
          this.callSnackbar(`You have to choose at least 1 game`, 'warning')
          return
        }

        if (this.applicationData.chosenGames.length > 5) {
          this.callSnackbar(`You can't choose more than 5 games`, 'warning')
          return
        }

        if (this.applicationData.message.length > 200) {
          this.callSnackbar(`The message cannot be more than 200 letters.`, 'warning')
          return
        }

        httpServer
          // URL должен быть в кебаб кейсе, то есть /add-application
          .post("/add-application", {
            isAuthorized: this.applicationData.isAuthorized,
            isMic: this.applicationData.isMic,
            games: this.applicationData.chosenGames,
            languages: this.applicationData.chosenLanguages,
            buddyMicrophone: this.applicationData.buddyMicrophone,
            message: this.applicationData.message,})
          .then(() => {
            this.dialog = false
            this.callSnackbar(`Your application has been created!`, 'success')
          })
          .catch(() => {});
      }
    },
    computed: {
      messageLimit() {
        return this.applicationData.message.length
      }
    },
    watch: {
      isDiscordDialog: {
        handler(discordWindowClosed) {
          if(this.dialog) {
            this.dialog = discordWindowClosed
          }
        },
      },
      isWarningDialog: {
        handler(warningWindowClosed) {
          if(this.dialog) {
            this.dialog = warningWindowClosed
          }
        },
      },
      dialog: {
        handler() {
          if(this.dialog && this.isAuthorized) {
            this.checkLastApplication()
          }
        },
      },
    },
  }
</script>
