<template>
  <v-footer class="bg-grey-darken-1">
    <v-row justify="center" no-gutters>

      <div v-for="link in links" :key="link">
        <router-link
          v-if="link.router"
          :to="link.path"
          class="text-decoration-none text-white"
        >
          <v-btn class="mx-2" rounded="xl" variant="text" >
            {{ link.title }}
          </v-btn>
        </router-link>
        <a
          v-else
          class="text-decoration-none	text-white"
          :href="link.path"
          target="_blank"
        >
          <v-btn class="mx-2" color="white" rounded="xl" variant="text">
            {{ link.title }}
          </v-btn>
        </a>
      </div>
      <v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} — <strong>BuddyRail</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      links: [{title: 'Home', path: '/', router: true}, {title: 'Rules', path:'rules', router: true}, {title: 'Youtube', path: 'https://www.youtube.com/@JustNik_guides'}, {title: 'Discord', path: 'https://discord.gg/vRS3HTZR4U'}]
    }
  }
}
</script>

<style scoped >
.router-link-active {
  color: #FC654D !important;

}
</style>
