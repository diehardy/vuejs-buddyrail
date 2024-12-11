<template>
  <v-container>
    <BuddyApplication
      :buddyInfo="selectedBuddy"
      v-model="isDialog"
    />
    <div class="train">
      <div class="d-flex justify-center flex-wrap">
      <TrainVue
        :applications="this.applications"
        @open-buddy-application="openBuddyApplication"
      />
      </div>
    </div>


    <div >
      <v-row class="justify-center">
        <v-col cols="10">
          <v-progress-linear color="rgb(252, 101, 77)" :indeterminate="isListLoading" :height="30" reverse>
            <div
              class="text-center text-h6"
              v-if="applications.length <= 0"
            >
            No buddies found. Try to change your filter.
            </div>
            <div v-if="isListLoading" class="text-center text-h6">
              Loading...
            </div>
          </v-progress-linear>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>


<script>
  import TrainVue from "@/components/Svg/TrainVue.vue";

  export default {
    components: {TrainVue},
      data ()  {
        return {
          isDialog: false,
          selectedBuddy: {},
        }
      },
      props: {
        applications: Array,
        isListLoading: Boolean,
      },
      methods: {
        openBuddyApplication(buddy) {
          this.selectedBuddy = buddy
          this.isDialog = true
        }
      },
  }
</script>


<style scoped>
  .main-train {
    width: 80%;
  }
  @media only screen and (max-width: 1024px) {
    .main-train {
      width: 100%;
    }
  }
</style>
