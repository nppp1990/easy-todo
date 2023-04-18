<template>
  <div class="type-layout" ref="refListLayout">
    <div class="indicator-item">
      <h3>我的列表</h3>
      <div class="indicator" v-show="overIndex === -1">
        <div class="indicator-circle"></div>
        <div class="indicator-line"></div>
      </div>
    </div>
    <div ref="refMenuList">
      <TransitionGroup name="list">
        <div v-for="(item, index) in list" :key="item.id" :class="{'indicator-item': isShowIndicator(index)}" ref="items">
          <type-item :name="item.name" :count="getTodoCount(item)"
                     :svg-name="`ic_type_white${item.svgIndex}`"
                     :color="`${colorList[item.colorIndex]}`"
                     :edit="index === currentEditIndex"
                     class="menu-item-layout" :class="{ 'item-selected': item.id === currentTypeId, 'status-active': index === activeIndex}"
                     @click="onItemClicked(item)"
                     draggable="true"
                     @drag="onDrag($event)"
                     @dragstart="onDragStart($event, item, index)"
                     @dragover.prevent="onDragOver($event, item, index)"
                     @dragend="onDragEnd($event, index)"
                     @contextmenu.stop.prevent="onMouseRightClick($event, item, index)"
                     @modify-name="(name)=>onNameModify(index, name)" />
          <div class="indicator bottom-indicator">
            <div class="indicator-circle"></div>
            <div class="indicator-line"></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <context-menu :menu-list="menuList" ref="refContextMenu"
                  @menu-dismiss="onContextMenuClosed" />
    <feedback-dialog :title="`删除列表${dialog.title } ？`" message="这将删除此列表中所有的提醒事项。"
                     v-model:show="dialog.showDeleteDialog"
                     @on-sure="deleteType" />
  </div>
</template>
<script setup>
import TypeItem from "@/components/menu/TypeItem.vue";
import ContextMenu from "@/components/common/ContextMenu.vue";
import { TYPE_COLOR_LIST } from "@/components/menu/menuConstants";
import { inject, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useCurrentTypeStore } from "@/store/currentType";
import { updateTypeList } from "@/storage/type";
import { getLastTypeId, saveLastTypeId } from "@/storage/history";
import { getTodoCount, getTypeItemById } from "@/utils/typeUtils";
import { INJECTION_KEY_EDIT_LAYOUT } from "@/utils/constant";
import FeedbackDialog from "@/components/common/FeedbackDialog.vue";
import { storeToRefs } from "pinia";

// 这里和.menu-item-layout的高度保持同步
const MENU_ITEM_HEIGHT = 36
const colorList = TYPE_COLOR_LIST

const refListLayout = ref(null)
const refMenuList = ref(null)
const refContextMenu = ref(null)
const emit = defineEmits(['rightClickItem'])

const { saveItem } = inject(INJECTION_KEY_EDIT_LAYOUT)
const currentTypeStore = useCurrentTypeStore()
const {currentTypeId} = storeToRefs(currentTypeStore)

// const list = ref(getTypeList())
const list = currentTypeStore.allTodoTypeList
// const test = currentTypeStore.allTodoTypeList
// test.splice(0, 1)

function updateCurrentType(item) {
  saveItem()
  nextTick(() => {
    currentTypeStore.updateCurrentType(item)
  })
}

// 列表数据展示相关
const {
  onItemClicked,
} = useTypeList()

// 列表拖拽相关
const {
  overIndex,
  onDragStart, onDragOver, onDragEnd, onDrag, isShowIndicator
} = useTypeListDrag(list, refListLayout, refMenuList)

// 右键contextMenu相关
const {
  currentEditIndex, activeIndex, menuList, dialog,
  onMouseRightClick, onContextMenuClosed, deleteType, onNameModify
} = useContextMenu(list, refContextMenu, emit)

function useTypeList() {
  watch(list, (newValue) => {
    updateTypeList(newValue)
  }, { deep: true })

  function onItemClicked(item) {
    updateCurrentType(item)
  }

  return {
    list,
    updateCurrentType, onItemClicked,
  }
}

function useTypeListDrag(list, refListLayout, refMenuList) {
  const isDraggingOut = ref(true)
  const isDragging = ref(false)
  const overIndex = ref(-2)
  const menuRect = ref({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  })
  const listLayout = reactive({
    bottom: 0
  })

  function initMenuRect() {
    let menuListRect = refMenuList.value.getBoundingClientRect()
    let { top, bottom, left, right } = menuListRect
    menuRect.value = { top, bottom, left, right }
    let layoutRect = refListLayout.value.getBoundingClientRect()
    listLayout.bottom = layoutRect.bottom
  }

  function onDragStart(ev, item, index) {
    isDragging.value = true
    console.log('----start drag', index)
  }

  function onDragOver(event, item, index) {
    overIndex.value = index
    let ratio = event.offsetY / MENU_ITEM_HEIGHT
    if (ratio < 1 / 4) {
      overIndex.value = index - 1
    } else if (ratio <= 3 / 4) {
      // todo
      overIndex.value = -2
    } else {
      overIndex.value = index
    }
  }

  function onDragEnd(event, index) {
    isDragging.value = false
    isDraggingOut.value = true
    // console.log('----drag end', event, index, overIndex.value)
    if (overIndex.value === -2) {
      return
    }
    // 要移动的item
    const moveIndex = index
    // 要插入的位置
    let insertIndex = overIndex.value
    if (moveIndex !== insertIndex) {
      const moveItem = list[moveIndex]
      list.splice(moveIndex, 1)
      if (moveIndex > insertIndex) {
        insertIndex++
      }
      list.splice(insertIndex, 0, moveItem)
    }
    isDragging.value = false
    isDraggingOut.value = true
    overIndex.value = -2
  }

  function onDrag(ev) {
    let { clientX, clientY } = ev
    if (clientX === 0 && clientY === 0) {
      return;
    }
    if (clientX < menuRect.value.left || clientX > menuRect.value.right) {
      overIndex.value = -2
      isDraggingOut.value = true
      return
    }
    if (clientY < menuRect.value.top - MENU_ITEM_HEIGHT / 4) {
      overIndex.value = -2
      isDraggingOut.value = true
      return
    }
    if (clientY > listLayout.bottom) {
      overIndex.value = -2
      isDraggingOut.value = true
      return
    }
    isDraggingOut.value = false
    if (clientY > menuRect.value.bottom) {
      // 最底下
      overIndex.value = list.length - 1
    }
  }

  function isShowIndicator(index) {
    if (!isDragging.value || isDraggingOut.value) {
      // 不再滑动、或者滑出列表
      return false
    }
    return index === overIndex.value
  }

  onMounted(initMenuRect)

  return {
    isDraggingOut, isDragging, overIndex, menuRect, listLayout,
    initMenuRect, onDragStart, onDragOver, onDragEnd, onDrag, isShowIndicator
  }
}

function useContextMenu(list, refContextMenu, emit) {
  const currentEditIndex = ref(-1)
  const activeIndex = ref(-2)

  const menuList = reactive([
    { value: '显示列表信息', type: 'showType' },
    -1,
    { value: '在新窗口中打开列表', type: 'none' },
    -1,
    {
      value: '排序方式',
      subMenu: [
        { value: '手动' },
        { value: '创建日期' },
        { value: '截止日期' },
        { value: '优先级' },
        { value: '标题' },
      ]
    },
    -1,
    { value: '重新命名', type: 'rename' },
    { value: '删除', type: 'delete' },
    {
      value: '移到群组', subMenu: [
        { value: '群组1' },
        { value: '群组2' },
        { value: '群组3' },
        { value: '群组4' },
        { value: '群组5' },
      ]
    },
    -1,
    { value: '共享列表', type: 'none' }
  ])
  const dialog = ref({
    showDeleteDialog: false,
    title: ''
  })


  function onMouseRightClick(ev, item, index) {
    activeIndex.value = index
    refContextMenu.value.showContextMenu(ev.clientX, ev.clientY)
  }

  function onContextMenuClosed(index, subIndex) {
    console.log('---onContextMenuClosed', index, subIndex)

    if (subIndex !== undefined) {
      // 点击sub-menu
    } else if (index !== undefined) {
      // 点击menu
      const type = menuList[index].type
      if (type === 'delete') {
        let typeItem = list[activeIndex.value]
        if (getTodoCount(typeItem) > 0) {
          dialog.value.showDeleteDialog = true
          dialog.value.title = typeItem.name
          return
        } else {
          deleteType()
        }
      } else if (type === 'showType') {
        let typeItem = list[activeIndex.value]
        emit('rightClickItem', { typeItem, type, index, subIndex })
      } else if (type === 'rename') {
        currentEditIndex.value = activeIndex.value
      }
    }
    // 把右键选中状态置空
    activeIndex.value = -1
  }

  watch(() => dialog.value.showDeleteDialog, (v) => {
    if (!v) {
      activeIndex.value = -1
    }
  })

  function deleteType() {
    const deleteIndex = activeIndex.value
    nextTick(() => {
      let isDelCurrent = list[deleteIndex].id === currentTypeId.value
      currentTypeStore.deleteType(list[deleteIndex])
      list.splice(deleteIndex, 1)
      // todo 暂时还没做list为空的情况
      if (isDelCurrent) {
        updateCurrentType(list[0])
      }
    })
  }

  function onNameModify(index, name) {
    currentEditIndex.value = -1
    list[index].name = name
    if (currentTypeId.value === list[index].id) {
      updateCurrentType(list[index])
    }
  }

  return {
    currentEditIndex, activeIndex, menuList, dialog,
    onMouseRightClick, onContextMenuClosed, deleteType, onNameModify
  }
}

function addType(item) {
  list.push(item)
  currentTypeStore.addType(item)
  nextTick(() => {
    updateCurrentType(item)
    refListLayout.value.scrollTo({
      top: refListLayout.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}

function modifyItem(newItem) {
  const oldIndex = list.findIndex(item => item.id === newItem.id)
  if (oldIndex !== -1) {
    console.log('---newItem', newItem)
    // list[oldIndex] = { ...list[oldIndex], ...newItem }
    let { name, colorIndex, svgIndex } = newItem
    list[oldIndex].name = name
    list[oldIndex].colorIndex = colorIndex
    list[oldIndex].svgIndex = svgIndex
    // currentId.value = newItem.id
    updateCurrentType(list[oldIndex])
  }
}

defineExpose({ addType, modifyItem })

onMounted(() => {
  // const typeStore = useTypeStore()
  // typeStore.setTypeId(100)
})
</script>
<style scoped lang="scss">
$--el-dialog-bg-color: red;

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>