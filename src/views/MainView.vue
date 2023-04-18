<template>
  <div class="main-container">
    <menu-layout class="menu-container" ref="refMenuLayout"/>
    <todo-content class="content-container" ref="refEditContent" />
  </div>
</template>
<script setup>
import MenuLayout from "@/components/menu/MenuLayout.vue";
import TodoContent from "@/components/edit/TodoContent.vue";
import { provide, ref } from "vue";
import { INJECTION_KEY_EDIT_LAYOUT, INJECTION_KEY_MENU_LAYOUT } from "@/utils/constant";
import { useCurrentTypeStore } from "@/store/currentType";

const refEditContent = ref(null)
console.log('---loadData')
useCurrentTypeStore().loadData()
provide(INJECTION_KEY_EDIT_LAYOUT, {
  saveItem() {
    if (refEditContent.value) {
      refEditContent.value.saveEditItem()
    }
  }
})
const refMenuLayout = ref(null)
provide(INJECTION_KEY_MENU_LAYOUT, {
  tryCreateType() {
    if (refMenuLayout.value) {
      refMenuLayout.value.createType()
    }
  }
})
</script>
<style scoped>
</style>