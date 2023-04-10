<template>
  <div class="edit-root">
    <span>没有提醒事项</span>
    <edit-item v-for="(item, index) in todoList" :key="index"
               v-model:name="item.name"
               v-model:date="item.date"
               v-model:timer="item.timer"
               v-model:is-flag="item.isFlag"
               v-model:show-extra="item.showExtra"
               @update:show-extra="collapseChanged(item, index)"
    />
  </div>
</template>
<script setup>
import EditItem from "@/components/edit/EditItem.vue";
import { reactive, ref, watch } from "vue";

const todoList = reactive([])
for (let i = 0; i < 3; i++) {
  todoList.push({
    name: 'name' + i,
    showExtra: false,
    date: '',
    timer: '',
    isFlag: false,
  })
}


const currentShowIndex = ref(-1)

function collapseChanged(item, index) {
  if (item.showExtra && currentShowIndex.value !== index) {
    if (currentShowIndex.value > -1) {
      todoList[currentShowIndex.value].showExtra = false
    }
    currentShowIndex.value = index
  }
}
</script>
<style scoped lang="scss">
.edit-root {
  & > span {
    color: var(--todo-gray3);
    font-size: 26px;
    position: absolute;
    left: 50%;
    top: 50%;
    display: inline-block;
    transform: translate(-50%, -50%);
  }
}
</style>