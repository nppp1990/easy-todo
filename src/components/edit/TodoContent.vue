<template>
  <div class="content-layout">
    <title-layout v-bind="currentType" />
    <edit-layout class="edit-layout" />
  </div>
</template>
<script setup>
import TitleLayout from "@/components/edit/TitleLayout.vue";
import { useCurrentTypeStore } from "@/store/currentType";
import { computed } from "vue";
import EditLayout from "@/components/edit/EditLayout.vue";
import { getTodoCount } from "@/utils/typeUtils";

const currentTypeStore = useCurrentTypeStore()

const currentType = computed(() => {
  const { name: title, colorIndex } = currentTypeStore.item
  return { title, count: getTodoCount(currentTypeStore.item), colorIndex }
})
</script>
<style scoped lang="scss">
.content-layout {
  display: flex;
  flex-direction: column;

  .edit-layout {
    flex: 1;
  }
}
</style>