<template>
  <v-sheet :min-height="100" :max-width="1200" border rounded class="mx-auto ma-5 pa-5">
    <h2 class="text-center">How to use BuddyRail</h2>
    <div class="mt-2">
      <v-row class="mt-5">
        <v-card class="mx-auto" max-width="600">
        <v-card-title class="text-wrap text-center">Become a buddy</v-card-title>
          <v-list :items="stepsOwnApplication" class="full-width-text">
            <v-list-item v-for="(item, index) in stepsOwnApplication" :key="index">
              <v-list-item-content>
                <v-list-item-title class="full-width-text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="mx-auto" max-width="600">
          <v-card-title class="text-wrap text-center">Finding available buddies</v-card-title>
            <v-list :items="stepsCheckingApplications" class="full-width-text">
              <v-list-item v-for="(item, index) in stepsCheckingApplications" :key="index">
                <v-list-item-content>
                  <v-list-item-title class="full-width-text">{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
        </v-card>
      </v-row>
    </div>
  </v-sheet>
</template>


<script>

export default {
  data() {
    return {
      stepsOwnApplication: [
        {
        title: '1. Authorize with discord to make an application',
        value: 1,
        },    
        {
        title: '2. Click "apply" below this form',
        value: 2,
        },
        {
        title: '3. Fill out the application form',
        value: 3,
        },
        {
        title: '4. Wait for your buddy! :)',
        value: 4,
        },
      ],
      stepsCheckingApplications: [
        {
        title: '1. Apply filters based on your preferences',
        value: 1,
        },
        {
        title: '2. Browse through applications to find your buddy',
        value: 2,
        },
        {
        title: '3. Find someone you like, click to copy nickname',
        value: 3,
        }, {
        title: '4. Click contact, add a friend, insert copied nickname and send a friend request.',
        value: 4,
        },
      ],
    }
  }
}
</script>

<style>
  .full-width-text {
    white-space: normal; /* Ensures the text wraps */
    overflow: visible; /* Ensures the text is not truncated */
  }
</style>