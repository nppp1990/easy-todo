<template>
  <div class="main-container">
    <menu-layout class="menu-container" />
    <div class="content-container">
      22---{{ incrementId }}
      <type-item-context-menu style="margin: 10px; margin-top: 500px;"/>
    </div>
  </div>
</template>
<script>
import MenuLayout from "@/components/menu/MenuLayout.vue";
import { mapState } from "vuex";
import TypeItemContextMenu from "@/components/menu/TypeItemContextMenu.vue";

export default {
  name: "MainView",
  components: {
    MenuLayout,
    TypeItemContextMenu,
  },
  computed: {
    ...mapState({
      incrementId: state => state.type.incrementId
    })
  }
}
</script>
<style scoped>
</style>