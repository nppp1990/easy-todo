<template>
  <div ref="refRoot">
    <div class="edit-root" ref="refTodoList">
      <span v-show="todoList.length === 0">没有提醒事项</span>
      <div class="header-layout flex-shrink0">
        <span class="tip">{{ doneCount }}项已完成&nbsp;·&nbsp;</span>
        <span :style="colorStyle" @click="clearDone"> 清除</span>
        <div class="middle" />
        <span class="hide" :style="colorStyle" @click="showDone = !showDone">{{ showDone ? '隐藏' : '显示' }}</span>
        <feedback-dialog title="清除已完成的提醒事项？" :message="`${doneCount}个已完成的提醒事项将从此列表中删除。\n此操作不能撤销`"
                         v-model:show="showClearDialog"
                         @on-sure="removeDoneList" />
      </div>
      <div class="divider flex-shrink0" />
      <TransitionGroup name="list">
        <edit-item v-for="(item, index) in showList" :key="item.id" ref="refTodoItems"
                   v-model:name="item.name"
                   v-model:note="item.note"
                   v-model:date="item.date"
                   v-model:timer="item.timer"
                   v-model:is-flag="item.isFlag"
                   v-model:done="item.done"
                   v-model:show-extra="item.showExtra"
                   @update:done="onDoneStatusChanged(item, index)"
                   @update:show-extra="collapseChanged(item, index)"
        />
      </TransitionGroup>
      <div class="other-layout flex-shrink0" @click="onClickBlank"></div>
    </div>
  </div>
</template>
<script setup>
import EditItem from "@/components/edit/EditItem.vue";
import { computed, nextTick, ref, watch } from "vue";
import { useCurrentTypeStore } from "@/store/currentType";
import { delDoc, saveDoc } from "@/storage/type";
import { createTodoDoc } from "@/service";
import { generateSortId, getDocList, getInsertIndex } from "@/utils/typeUtils";
import { TYPE_COLOR_LIST } from "@/components/menu/menuConstants";
import FeedbackDialog from "@/components/common/FeedbackDialog.vue";

const todoList = ref([])
const showDone = ref(true)
const showList = computed(() => {
  if (showDone.value) {
    return todoList.value
  } else {
    return todoList.value.filter(item => !item.done)
  }
})
const currentTypeStore = useCurrentTypeStore()
const currentTypeId = ref('')
let currentShowIndex = -1

currentTypeStore.$subscribe((mutation, state) => {
  if (currentTypeId.value !== state.item.id) {
    initList(state.item)
  }
})

// todoList变化
// function onItemChanged(item, index, args) {
//   console.log('---onItemChanged',)
// }

function onDoneStatusChanged(item, index, publishEvent = true) {
  if (item.showExtra) {
    return
  }

  todoList.value.splice(index, 1)
  let insertIndex = getInsertIndex(todoList.value, item)
  todoList.value.splice(insertIndex, 0, item)
  if (publishEvent) {
    saveDoc(item)
    currentTypeStore.toggleDoneStatus(item.id, item.done)
  }
  return insertIndex
}

function collapseChanged(item, index) {
  if (item.showExtra) {
    if (currentShowIndex !== index) {
      handleLastItem()
      currentShowIndex = index
    }
    // 如果item看不完整需要移动todoList
    // moveTodoList(index)
  } else {
    // 目前只有nameInput回车会走到这
    handleLastItem(index)
    currentShowIndex = -1
    if (item.name !== '') {
      // 收起当前的item以后、在下面位置创建一个新的item
      createItem(index + 1)
    }
  }
}

function moveItem(item, lastIndex, changedCallback) {
  let copyList = [...todoList.value]
  copyList.splice(lastIndex, 1)
  let expectIndex = getInsertIndex(copyList, item)
  if (expectIndex === lastIndex) {
    // 如果位置不变、就只收起+保存
    item.showExtra = false
    // saveDoc(item)
  } else {
    // 收起+移动位置+通知全局变量变化
    item.showExtra = false
    todoList.value.splice(lastIndex, 1)
    todoList.value.splice(expectIndex, 0, item)
    if (changedCallback) {
      changedCallback()
    }
  }
}

const refTodoList = ref(null)
const refRoot = ref(null)
const refTodoItems = ref([])
let listRect = null

function getListRect() {
  if (!listRect) {
    listRect = refTodoList.value.getBoundingClientRect()
  }
  return listRect
}

function moveTodoList(index) {
  // todo 展开动画el-collapse-transition不能控制时间、所以只能这么做了，后面可以考虑自定义一个collapse
  // 而且现在动画是两段是的、足够丑陋
  setTimeout(() => {
    if (!refTodoList.value) {
      return
    }
    let item = refTodoItems.value[index].getItemElement()
    let itemRect = item.getBoundingClientRect()
    if (itemRect.top < getListRect().top) {
      refTodoList.value.scrollBy({
        top: itemRect.top - getListRect().top,
        behavior: 'smooth'
      })
    } else if (itemRect.bottom > getListRect().bottom) {
      refTodoList.value.scrollBy({
        top: itemRect.bottom - getListRect().bottom,
        behavior: 'smooth'
      })
    }
  }, 1000)
}

function handleLastItem(lastIndex = currentShowIndex) {
  if (lastIndex === -1) {
    return
  }
  const currentItem = todoList.value[lastIndex]
  if (currentItem.name === '') {
    // name为空、直接删除即可
    deleteTodo(currentItem, lastIndex)
  } else if (currentItem.saved) {
    moveItem(currentItem, lastIndex, () => {
      currentTypeStore.toggleDoneStatus(currentItem.id, currentItem.done)
    })
    saveDoc(currentItem)
  } else {
    // 保存新建的todo
    saveNewTodo(currentItem, lastIndex)
  }
}

function initList(type) {
  currentTypeId.value = type.id
  // todo 暂时每次都从storage取、可以从内存取的、但是麻烦点
  todoList.value = getDocList(type)
  currentShowIndex = -1
  nextTick(() => {
    refRoot.value.scrollTo({ top: 41 })
  })
}

initList(currentTypeStore.item)

function createItem(index) {
  let todoItem = createTodoDoc()
  if (index === undefined) {
    currentShowIndex = todoList.value.length
  } else {
    currentShowIndex = index
  }
  // 更新todoList
  todoList.value.splice(currentShowIndex, 0, todoItem)
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

const doneCount = computed(() => {
  return todoList.value.filter(item => item.done).length
})
const colorStyle = computed(() => {
  const { colorIndex } = currentTypeStore.item
  return { color: TYPE_COLOR_LIST[colorIndex] }
})
const showClearDialog = ref(false)

function removeDoneList() {
  let doneList = todoList.value.filter(item => item.done)
  todoList.value = todoList.value.filter(item => !item.done)
  currentTypeStore.delAllDoneItem()
  for (const doneItem of doneList) {
    delDoc(doneItem)
  }
}

function clearDone() {
  if (doneCount.value === 0) {
    return
  }
  showClearDialog.value = true
}

/**
 * 主动触发addTodo
 */
function addTodoItem() {
  if (currentShowIndex !== -1) {
    let currentItem = todoList.value[currentShowIndex]
    if (!currentItem.saved && currentItem.name === '') {
      // 如果没有保存、并且name为空，则什么都不处理
      return
    }
    handleLastItem()
  }
  createItem()
}

defineExpose({ addTodoItem, saveItem: handleLastItem })

function saveNewTodo(todoItem, index) {
  let sortId = generateSortId(todoList.value, index)
  todoItem.setSortId(sortId)
  todoItem.saved = true
  moveItem(todoItem, index)
  // 创建的todo持久化
  saveDoc(todoItem)
  // 更新type的idList
  if (todoItem.done) {
    currentTypeStore.addDoneItem(todoItem.id)
  } else {
    currentTypeStore.addTodoItem(todoItem.id)
  }
}

function deleteTodo(todoItem, index) {
  // ui上删除列表的item
  todoList.value.splice(index, 1)
  if (!todoItem.saved) {
    return
  }
  // 数据删除item
  delDoc(todoItem)
  currentTypeStore.delTodoItem(todoItem.id)
}
</script>
<style scoped lang="scss">
.edit-root {
  display: flex;
  flex-direction: column;
  height: calc(100% + 41px);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  & > span {
    color: var(--todo-gray3);
    font-size: 26px;
    position: absolute;
    left: 50%;
    top: 50%;
    display: inline-block;
    transform: translate(-50%, -50%);
  }

  .header-blank {
    height: 40px;
  }

  .header-layout {
    margin: 0 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    height: 40px;
    position: relative;

    .tip {
      color: var(--todo-gray4);
    }

    .middle {
      flex: 1;
    }
  }

  .divider {
    display: block;
    width: 100%;
    margin-left: 16px;
    height: 1px;
    background-color: var(--divider-gray2);
  }

  .other-layout {
    flex: 1;
  }
}

.flex-shrink0 {
  flex-shrink: 0;
}

.list-move {
  transition: all 0.5s ease;
}
</style>