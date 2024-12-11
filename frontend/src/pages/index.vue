<template>
  <div>
    <SnackbarMessage
    v-model="snackbar"
    :type="snackbarType">
    {{ snackbarMessage }}
    </SnackbarMessage>
    <DiscordBtn v-show="!isAuthorized" />
    <MyApplications v-model="myApplicationsDialog" />

    <v-tooltip
      text="Your applications"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-fab
          class="ml-5"
          v-show="isAuthorized"
          v-bind="props"
          @click="openMyApplications"
          icon="mdi-bookshelf"
          color="yellow"
        />
      </template>
    </v-tooltip>

    <MainTitle class="mt-5">Find your perfect teammate on BuddyRail</MainTitle>

    <DiscordWarning
      v-model="discordDialog"
      @closeApplicationDialog="discordDialog"
    />
    <TooManyApplications
      v-model="warningDialog"
      @closeApplicationDialog="warningDialog"
      @openApplications="openMyApplications"
    />

    <BuddiesList
      :applications="applications"
      :isListLoading="isListLoading"
    />

    <BuddiesFilter
      :games="games"
      :languages="languages"
      @setApplications="setApplications"
      @callDiscord="callDiscord"
      @isLoading="isLoading"
      :isAuthorized="isAuthorized"
    />
    <HowToUse />
    <ApplicationForm
      :games="games"
      :languages="languages"
      :isAuthorized="isAuthorized"
      :isDiscordDialog="discordDialog"
      :isWarningDialog="warningDialog"
      @callDiscord="callDiscord"
      @callWarning="callWarning"
      @callSnackbar="callSnackbar"
    />
    <ActivityAnalysis />
    <AppFooter />
  </div>
</template>

<script>
import {httpServer} from '@/main'

export default {
  data() {
    return {
      games: [],
      languages: [],
      applications: [],
      isAuthorized: false,
      authorizedUser: {},
      discordDialog: false,
      warningDialog: false,
      isListLoading: false,
      myApplicationsDialog: false,
      snackbarMessage: 'test',
      snackbar: false,
      snackbarType: '',
    }
  },
  methods: {
    getData() {
      httpServer
        .get("/get-input-data")
        .then((response) => {
            this.games = response.data.games
            this.languages = response.data.languages
        })
        .catch(() => {});
    },
    setApplications (gottenApplications) {
      this.applications = gottenApplications
    },
    callDiscord(value) {
      this.discordDialog = value
    },
    callWarning(value) {
      this.warningDialog = value
    },
    openMyApplications() {
      this.myApplicationsDialog = !this.myApplicationsDialog
    },
    callSnackbar(snackbarContent) {
      this.snackbarMessage = snackbarContent.message;
      this.snackbarType = snackbarContent.type;
      this.snackbar = true;
    },
    checkAuth() {
      httpServer
        .get("/is-authenticated")
        .then((response) => {
          if(response.status === 200) {
            this.isAuthorized = true;
            this.authorizedUser = response.data;
          } else {
            this.isAuthorized = false;
            this.authorizedUser = {};
          }
        })
        .catch(() => {
          this.isAuthorized = false
        });
    },
    isLoading(val) { // emit from buddies filter
      this.isListLoading = val
    }
  },
  mounted() {
    this.checkAuth()
    this.getData()
  }
}
</script>
