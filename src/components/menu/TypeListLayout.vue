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
          <type-item :name="item.name" :count="item.count"
                     :svg-name="`ic_type_white${item.svgIndex}`"
                     :color="`${colorList[item.colorIndex]}`"
                     :edit="index === currentEditIndex"
                     class="menu-item-layout" :class="{ 'item-selected': item.id === currentId, 'status-active': index === activeIndex}"
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
    <el-dialog
      class="feedback"
      v-model="dialog.showDeleteDialog"
      :show-close="false"
      align-center
      width="260px">
      <div class="type-dialog">
        <img src="src/assets/images/haha.jpeg" alt="">
        <h3>删除列表 "{{ dialog.title }}" ？</h3>
        <span class="message">这将删除此列表中所有的提醒事项。</span>
        <div style="margin-top: 16px">
          <el-button @click="onDelTypeDialogMiss(false)">取消</el-button>
          <el-button type="primary" @click="onDelTypeDialogMiss(true)">删除</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import TypeItem from "@/components/menu/TypeItem.vue";
import ContextMenu from "@/components/common/ContextMenu.vue";
import { TYPE_COLOR_LIST } from "@/components/menu/menuConstants";
import { nextTick, onMounted, reactive, ref } from "vue";
import { useCurrentTypeStore } from "@/store/currentType";
import { useTypeStore } from "@/store/type";

// 这里和.menu-item-layout的高度保持同步
const MENU_ITEM_HEIGHT = 36
const colorList = TYPE_COLOR_LIST

const refListLayout = ref(null)
const refMenuList = ref(null)
const refContextMenu = ref(null)
const emit = defineEmits(['rightClickItem'])

// 列表数据展示相关
const {
  list, currentId,
  updateCurrentType, onItemClicked,
} = useTypeList()

// 列表拖拽相关
const {
  overIndex,
  onDragStart, onDragOver, onDragEnd, onDrag, isShowIndicator
} = useTypeListDrag(list, refListLayout, refMenuList)

// 右键contextMenu相关
const {
  currentEditIndex, activeIndex, menuList, dialog,
  onMouseRightClick, onContextMenuClosed, onDelTypeDialogMiss, onNameModify
} = useContextMenu(list, refContextMenu, emit, updateCurrentType, currentId)

function useTypeList() {
  const list = ref([
    { colorIndex: 1, svgIndex: 0, name: 'name1', count: 2, id: 1 },
    { colorIndex: 7, svgIndex: 1, name: 'name2', count: 0, id: 2 },
    { colorIndex: 4, svgIndex: 1, name: 'name3', count: 1, id: 3 },
    { colorIndex: 1, svgIndex: 2, name: 'name4', count: 4, id: 4 },
    { colorIndex: 1, svgIndex: 2, name: 'name5', count: 4, id: 5 },
    { colorIndex: 1, svgIndex: 12, name: 'name6', count: 4, id: 6 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx1', count: 4, id: 7 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx2', count: 4, id: 8 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx3', count: 4, id: 9 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx4xx', count: 4, id: 10 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx43', count: 4, id: 11 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx42', count: 4, id: 12 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx41', count: 4, id: 13 },
    { colorIndex: 10, svgIndex: 22, name: 'xxx45', count: 4, id: 14 },
  ])
  const currentId = ref(list.value[0].id)

  const currentTypeStore = useCurrentTypeStore()

  function updateCurrentType(item) {
    currentTypeStore.updateCurrentType(item)
  }

  function onItemClicked(item) {
    currentId.value = item.id
    updateCurrentType(item)
  }
  updateCurrentType(list.value[0])

  return {
    list, currentId, currentTypeStore,
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
      const moveItem = list.value[moveIndex]
      list.value.splice(moveIndex, 1);
      if (moveIndex > insertIndex) {
        insertIndex++
      }
      list.value.splice(insertIndex, 0, moveItem);
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
      overIndex.value = list.value.length - 1
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

function useContextMenu(list, refContextMenu, emit, updateCurrentType, currentId) {
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
  const dialog = reactive({
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
        let typeItem = list.value[activeIndex.value]
        // list.value.splice(activeIndex.value, 1)
        if (typeItem.count > 0) {
          dialog.showDeleteDialog = true
          dialog.title = typeItem.name
          return
        } else {
          list.value.splice(activeIndex.value, 1)
        }
      } else if (type === 'showType') {
        let typeItem = list.value[activeIndex.value]
        emit('rightClickItem', { typeItem, type, index, subIndex })
      } else if (type === 'rename') {
        currentEditIndex.value = activeIndex.value
      }
    }
    // 把右键选中状态置空
    activeIndex.value = -1
  }

  function onDelTypeDialogMiss(yes) {
    dialog.showDeleteDialog = false
    const deleteIndex = activeIndex.value
    activeIndex.value = -1
    if (yes) {
      nextTick(() => {
        let isDelCurrent = list.value[deleteIndex].id === currentId.value
        list.value.splice(deleteIndex, 1)
        // todo 暂时还没做list为空的情况
        if (isDelCurrent) {
          currentId.value = list.value[0].id
          updateCurrentType(list.value[0])
        }
      })
    }
  }

  function onNameModify(index, name) {
    console.log('---name', index, name)
    currentEditIndex.value = -1
    list.value[index].name = name
    if (currentId.value === list.value[index].id) {
      updateCurrentType(list.value[index])
    }
  }

  return {
    currentEditIndex, activeIndex, menuList, dialog,
    onMouseRightClick, onContextMenuClosed, onDelTypeDialogMiss, onNameModify
  }
}

function changeStatus(isSelected, currentId) {
  isSelected.value = isSelected
  if (currentId !== undefined) {
    currentId.value = currentId
  }
}

function addType(item) {
  list.value.push(item)
  nextTick(() => {
    currentId.value = item.id
    updateCurrentType(item)
    refListLayout.value.scrollTo({
      top: refListLayout.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}

function modifyItem(newItem) {
  const oldIndex = list.value.findIndex(item => item.id === newItem.id)
  if (oldIndex !== -1) {
    console.log('---newItem', newItem)
    list.value[oldIndex] = { ...list.value[oldIndex], ...newItem }
    currentId.value = newItem.id
    updateCurrentType(list.value[oldIndex])
  }
}

defineExpose({ changeStatus, addType, modifyItem })

onMounted(() => {
  const typeStore = useTypeStore()
  typeStore.setTypeId(100)
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