<template>
  <q-page class="flex flex-center">
    <q-btn color="white" text-color="dark" label="New item" />
    <div v-for="meal in meals" :key="meal.title">
      <q-card color="white">
        <q-card-title>
          {{ meal.title }}
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          {{ meal.detail }}
        </q-card-main>
      </q-card>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import {mapState} from 'vuex'

export default {
  name: 'PageIndex',
  computed: {
    ...mapState('eurest', {
      meals: state => state.meals
    })
  },
  mounted () {
    this.$store.dispatch('eurest/GET_DINNER_TODAY')
  }
}
</script>
