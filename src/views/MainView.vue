<template>
  <div class="main-container">
    <menu-layout class="menu-container" />
    <div class="content-container">
      22---{{ incrementId }}
    </div>
  </div>
</template>
<script>
import MenuLayout from "@/components/menu/MenuLayout.vue";
import { mapState } from "vuex";

export default {
  name: "MainView",
  components: {
    MenuLayout,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      incrementId: state => state.type.incrementId
    })
  },
  mounted() {
  },
  methods: {
  }

}
</script>
<style scoped>
</style>