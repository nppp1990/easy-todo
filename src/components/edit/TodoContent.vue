<template>
  <div class="content-layout">
    <title-layout v-bind="currentType" />
    12345
  </div>
</template>
<script setup>
import TitleLayout from "@/components/edit/TitleLayout.vue";
// import { TYPE_COLOR_LIST } from "@/components/menu/menuConstants";
import { useCurrentTypeStore } from "@/store/currentType";
import { computed } from "vue";
// const colorList = TYPE_COLOR_LIST
const currentTypeStore = useCurrentTypeStore()

const currentType = computed(() => {
  const { name: title, count, colorIndex } = currentTypeStore.item
  return { title, count, colorIndex }
})
</script>
<style scoped lang="scss">
.content-layout {
  display: flex;
  flex-direction: column;
}
</style>