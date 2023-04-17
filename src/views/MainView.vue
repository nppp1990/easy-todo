<template>
  <div class="main-container">
    <menu-layout class="menu-container" />
    <todo-content class="content-container" ref="refEditContent" />
  </div>
</template>
<script setup>
import MenuLayout from "@/components/menu/MenuLayout.vue";
import TodoContent from "@/components/edit/TodoContent.vue";
import { provide, ref } from "vue";
import { INJECTION_KEY_EDIT_LAYOUT } from "@/utils/constant";
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
</script>
<style scoped>
</style>