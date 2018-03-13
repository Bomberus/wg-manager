<template>
  <q-page class="flex flex-center">
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
    // this.$store.dispatch('eurest/GET_DINNER_TODAY')
  }
}
</script>
