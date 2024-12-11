<template>
  <div>
    <BuddyApplication v-model="applicationDialog" :buddyInfo="chosenApplication"/>
    <div class="text-center pa-4">
      <v-dialog style="z-index: 2000;" v-model="myApplicationsDialog" max-width="800">
        <v-card
          prepend-icon="mdi-bookshelf"
          title="Your applications"
        >
          <template v-slot:text>
            <v-list lines="one" v-if="formattedApplications.length > 0">
                <v-list-item class="mt-5"
                  v-for="(application, index) in formattedApplications"
                  :key="index"
                  :title="application.formattedDate"
                >

                  <template v-slot:prepend>
                    <div class="bg-yellow rounded-circle mx-auto d-flex justify-center align-center mr-5"
                    style="height: 64px; width: 64px;">
                        <div class="text-h4 text-black">{{ index + 1 }}</div>
                    </div>
                  </template>

                  <template v-slot:subtitle>
                      <div>{{ application.message }}</div>
                  </template>

                  <template v-slot:append>
                      <v-btn
                        @click="openApplication(application)"
                        color="yellow"
                        icon="mdi-magnify"
                        variant="text"
                      />
                      <v-btn
                        @click="deleteApplication(application.id_application)"
                        color="yellow"
                        icon="mdi-delete"
                        variant="text"
                      />
                  </template>
                </v-list-item>
            </v-list>
            <div v-else>
              You didn't create any applications yet.
            </div>
          </template>

          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog">
              Close
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>



<script>
import {httpServer} from '@/main'

export default {
    data() {
        return {
            userApplications: [],
            applicationDialog: false,
            chosenApplication: {},
        }
    },
    props: {
      modelValue: Boolean,
    },
    emits: ['update:modelValue'],
    computed: {
        myApplicationsDialog: {
        get() {
          return this.modelValue
        },
        set(myApplicationsDialog) {
          this.$emit('update:modelValue', myApplicationsDialog)
        }
      },
      formattedApplications() {
      return this.userApplications.map(application => ({
        ...application,
        formattedDate: new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date(application.date_created)),
      }));
    },
    },
    methods: {
        closeDialog () { 
            this.$emit('update:modelValue', false)
        },

        getUserApplications() {
            httpServer
              .post("/get-user-applications")
              .then((response) => {
                this.userApplications = response.data.userApplications
              })
              .catch(() => {});
        },

        openApplication(application) {
            this.chosenApplication = application
            this.applicationDialog = true
        },

        deleteApplication(idApplication) {
            httpServer
              .post("/delete-application", {idApplication: idApplication})
              .then(() => {
                this.getUserApplications()
            })
              .catch(() => {});
        }
        
    },
    watch: {
        myApplicationsDialog: {
            handler() {
                if(this.myApplicationsDialog) {
                    this.getUserApplications()
                }
            },
         },
    }
}
</script>