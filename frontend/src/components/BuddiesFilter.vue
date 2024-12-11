<template>
  <div>
    <v-row class="justify-center ga-5 my-5">
      <v-btn
        class="bg-cyan-darken-1"
        :class="prevBtnStyles"
        :disabled="applicationFilter.currentPage == 1 || applicationFilter.currentPage == 0"
        @click="decreaseCounter"
      >
        Prev
      </v-btn>
      <v-btn
        class="bg-pink-accent-2"
        @click="increaseCounter"
        :class="nextBtnStyles"
        :disabled="applicationFilter.currentPage == applicationFilter.totalPages"
      >
        Next
      </v-btn>
    </v-row>

    <v-sheet :min-height="100" :max-width="600" border rounded class="mx-auto ma-5">
      <v-row>
        <v-col cols="10" class="mx-auto ma-0 pa-0 mt-5">
          <v-switch
            v-model="applicationFilter.isMic"
            label="Do you have a microphone?"
            color="yellow"
            hide-details
            class="ma-0 pa-0" />
        </v-col>
        <v-col cols="10" class="mx-auto ma-0 pa-0">
          <div class="d-flex align-center flex-wrap">
            <v-switch
            v-model="applicationFilter.isAuthorized"
            label="Discord protection"
            color="yellow"
            hide-details
            class="ma-0 pa-0 mr-5" />
            <v-chip>
              Protected applications: {{applicationFilter.discordProtectedApplications}}
            </v-chip>
          </div>
        </v-col>
        <v-col cols="10" class="mx-auto">
          <v-select
            variant="outlined"
            label="Does your buddy have a microphone?"
            item-name="title"
            item-value="value"
            :items="microphoneAvailability"
            v-model="applicationFilter.buddyMicrophone"
          />
        </v-col>

        <v-col cols="10" class="mx-auto">
          <v-autocomplete
            autocomplete="off"
            v-show="languages.length > 0"
            chips
            v-model="applicationFilter.chosenLanguages"
            label="Languages you want to communicate in"
            :items="languages"
            item-title="language_name"
            item-value="id_language"
            multiple
            variant="outlined"
          />
        </v-col>
        <v-col cols="10" class="mx-auto">
          <v-autocomplete v-show="games.length > 0"
            autocomplete="off"
            chips
            v-model="applicationFilter.chosenGames"
            label="Choose games you want to play"
            :items="games"
            item-title="name_game"
            item-value="id_game"
            multiple
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-sheet>

  </div>

</template>

<script>
  import {httpServer} from '@/main'

  export default {
    data() {
      return {
        applicationFilter: {
          isMic: true,
          buddyMicrophone: 'Has microphone',
          isAuthorized: false,
          chosenGames :[],
          chosenLanguages: [],
          currentPage: 1,
          totalPages: 1,
          discordProtectedApplications: 0,
        },
        applications: [],
        isListLoading: false,
        microphoneAvailability: [
          {title: `Doesn't matter`, value: 'Both'},
          {title: `No microphone`, value: 'No microphone'},
          {title: `Has microphone`, value: 'Has microphone'}
        ]
      }
    },
    mounted() {
      this.applyFilter();
    },
    methods: {
      applyFilter() {
        this.isListLoading = true
        httpServer
          .get("/get-applications",
          {
            params:
                {
                    isAuthorized: this.applicationFilter.isAuthorized,
                    languages: this.applicationFilter.chosenLanguages,
                    games: this.applicationFilter.chosenGames,
                    isMic: this.applicationFilter.isMic,
                    buddyMicrophone: this.applicationFilter.buddyMicrophone,
                    currentPage: this.applicationFilter.currentPage,
                }
          })
          .then((response) => {
            if (this.applicationFilter.totalPages != response.data.totalPages) {
              this.applicationFilter.currentPage = 1
              this.applicationFilter.totalPages = response.data.totalPages

              if (this.applicationFilter.totalPages < 1) {
                this.applicationFilter.currentPage = 0
              }

            }

            this.applicationFilter.discordProtectedApplications = response.data.discordProtectedApplications
            this.applications = response.data.filteredApplications;
            this.isListLoading = false;
          })
          .catch(() => this.isListLoading = false);
      },
      decreaseCounter() {
        this.applicationFilter.currentPage--
      },
      increaseCounter() {
        this.applicationFilter.currentPage++
      }
    },
    props: {
      games: Array,
      languages: Array,
      isAuthorized: Boolean,
    },
    watch: {
      applications: {
        handler(newApplication) {
          this.$emit('setApplications', newApplication)
        },
      },
      applicationFilter: {
        handler() {
          // if you're looking for discord applications, you have to be authorized
          if (this.applicationFilter.isAuthorized && !this.isAuthorized) {
            this.applicationFilter.isAuthorized = false
            this.$emit('callDiscord', true)
          } else {
            this.applyFilter();
          }
        },
        deep: true
      },
      isListLoading : {
        handler(val) {
          this.$emit('isLoading', val)
        }
      }
    },
    computed: {
      prevBtnStyles() {
        let btnClasses = ''

        if (this.applicationFilter.currentPage === 1) {
          btnClasses = 'bg-grey-darken-4 opacity-10'
        }

        if (this.applicationFilter.currentPage === 0) {
          btnClasses = 'd-none'
        }

        return btnClasses
      },

      nextBtnStyles() {
        let btnClasses = ''

        if (this.applicationFilter.currentPage == this.applicationFilter.totalPages) {
          btnClasses = 'bg-grey-darken-4 opacity-10'
        }

        if (this.applicationFilter.totalPages == 0) {
          btnClasses = 'd-none'
        }

        return btnClasses
      }
    }
  }
</script>
