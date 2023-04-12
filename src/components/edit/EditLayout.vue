<template>
  <div class="edit-root">
    <span v-show="todoList.length === 0">没有提醒事项</span>
    <edit-item v-for="(item, index) in todoList" :key="index"
               v-model:name="item.name"
               v-model:note="item.note"
               v-model:date="item.date"
               v-model:timer="item.timer"
               v-model:is-flag="item.isFlag"
               v-model:show-extra="item.showExtra"
               @update:show-extra="collapseChanged(item, index)"
               @item-change="args=>onItemChanged(index, args)"
    />
    <div class="other-layout" @click="onClickBlank"></div>
  </div>
</template>
<script setup>
import EditItem from "@/components/edit/EditItem.vue";
import { nextTick, ref } from "vue";
import { useCurrentTypeStore } from "@/store/currentType";
import { delDoc, getDocList, saveDoc } from "@/storage/type";
import { createTodoDoc } from "@/service";
import { useTypeStore } from "@/store/type";

const todoList = ref([])
const currentTypeStore = useCurrentTypeStore()
const typeStore = useTypeStore()
const currentTypeId = ref('')
let currentShowIndex = -1

currentTypeStore.$subscribe((mutation, state) => {
  if (currentTypeId.value !== state.item.id) {
    initList(state.item)
  }
})

// todoList变化
function onItemChanged(index, args) {
  if (args && args.key === 'name' && args.oldValue === '') {
    // name由空变为非空、则表示新建一个todo
    todoList.value[index].id = typeStore.incrementDocId()
    saveTodo(todoList.value[index])
  } else {
    if (todoList.value[index].id > -1) {
      saveDoc(todoList.value[index])
    }
  }
}

function collapseChanged(item, index) {
  if (item.showExtra && currentShowIndex !== index) {
    handleLastItem()
    currentShowIndex = index
  }
}

function handleLastItem() {
  if (currentShowIndex === -1) {
    return
  }
  const currentItem = todoList.value[currentShowIndex]
  if (currentItem.id === -1) {
    // 如果id为-1表示撤销新建item
    todoList.value.splice(currentShowIndex, 1)
  } else if (currentItem.name === '') {
    // 如果name为空表示删除该todo、所以还要更新存储和count
    todoList.value.splice(currentShowIndex, 1)
    deleteTodo(currentItem)
  } else {
    // 收起
    todoList.value[currentShowIndex].showExtra = false
  }
}

function initList(type) {
  currentTypeId.value = type.id
  todoList.value = getDocList(type)
  currentShowIndex = -1
}

initList(currentTypeStore.item)

function createItem() {
  let todoItem = createTodoDoc()
  // todoItem.showExtra = true
  // 更新todoList
  todoList.value.push(todoItem)
  currentShowIndex = todoList.value.length - 1
  nextTick(() => {
    // 为了展示动画，延后把showExtra改变
    todoList.value[currentShowIndex].showExtra = true
  })
}

// 点击空白处
function onClickBlank() {
  if (currentShowIndex === -1) {
    // 当前没有在编辑状态的todo，点击空白表示新建一个item
    createItem()
  } else {
    handleLastItem()
    currentShowIndex = -1
  }
}

function addTodoItem() {
  if (currentShowIndex !== -1) {
    if (todoList.value[currentShowIndex].id === -1) {
      // 当前为正在编辑的新todo，不作处理
      return
    }
    handleLastItem()
  }
  createItem()
}

defineExpose({ addTodoItem })


function saveTodo(todoItem) {
  // 创建的todo持久化
  saveDoc(todoItem)
  // 更新type的idList
  currentTypeStore.addTodoItem(todoItem.id)
}

function deleteTodo(todoItem) {
  delDoc(todoItem)
  currentTypeStore.delTodoItem(todoItem.id)
}
</script>
<style scoped lang="scss">
.edit-root {
  display: flex;
  flex-direction: column;

  & > span {
    color: var(--todo-gray3);
    font-size: 26px;
    position: absolute;
    left: 50%;
    top: 50%;
    display: inline-block;
    transform: translate(-50%, -50%);
  }

  .other-layout {
    flex: 1;
  }
}
</style>