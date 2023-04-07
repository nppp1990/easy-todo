<template>
  <div class="main-container">
    <menu-layout class="menu-container" />
    <todo-content class="content-container" />
  </div>
</template>
<script>
import MenuLayout from "@/components/menu/MenuLayout.vue";
import TodoContent from "@/components/edit/TodoContent.vue";
import { mapState } from "vuex";

export default {
  name: "MainView",
  components: {
    MenuLayout,
    TodoContent,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      incrementId: state => state.type.incrementId
    })
  },
  mounted() {
  },
  methods: {}

}
</script>
<style scoped>
</style>