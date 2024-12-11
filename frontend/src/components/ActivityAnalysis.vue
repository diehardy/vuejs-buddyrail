<template>
  <div>
    <div class="text-center text-h5">Activity Overview:</div>
    <div
      class="d-flex justify-center align-center my-5 ga-5 flex-wrap"
      style="width: 100%">
      <v-chip
      class="pa-5"
      prepend-icon="mdi-account-group"
      color="white">Total users: {{ siteActivity.totalUsers }}</v-chip>
      <v-chip
      class="pa-5"
      prepend-icon="mdi-note-text-outline"
      color="white">Total applications: {{ siteActivity.totalApplications }}</v-chip>
      <v-chip
      class="pa-5"
      prepend-icon="mdi-account"
      color="white">New users today: {{ siteActivity.dailyUsers }}</v-chip>
      <v-chip
      class="pa-5"
      prepend-icon=" mdi-note-check"
      color="white">New applications today: {{ siteActivity.dailyApplications }}</v-chip>
      <v-chip
      class="pa-5"
      prepend-icon="mdi-gamepad-variant"
      color="white">Active users today: {{ siteActivity.dailyActiveUsers }}</v-chip>
    </div>
  </div>
</template>

<script>
  import {httpServer} from '@/main'

  export default {
    data() {
      return {
        siteActivity: {
          totalUsers: 0,
          totalApplications: 0,
          dailyUsers: 0,
          dailyApplications: 0,
          dailyActiveUsers: 0,
        }
      }
    },
    methods: {
      getAnalytics(){
        httpServer
          .get("/get-analytics")
          .then((response) => {
            this.siteActivity = {...response.data}
          })
          .catch(() => {});
      },
    },
    mounted() {
      this.getAnalytics()
    }
  }
</script>
