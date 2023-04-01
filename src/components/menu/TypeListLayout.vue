<template>
  <div class="type-layout" ref="listLayout">
    <div class="indicator-item">
      <h3>我的列表</h3>
      <div class="indicator" v-show="overIndex === -1">
        <div class="indicator-circle"></div>
        <div class="indicator-line"></div>
      </div>
    </div>
    <div ref="menuList">
      <TransitionGroup name="list">
        <div v-for="(item, index) in list" :key="item.id" :class="{'indicator-item': isShowIndicator(index)}" ref="items">
          <type-item :name="item.name" :count="item.count"
                     :svg-name="`ic_type_white${item.svgIndex}`"
                     :color="`${colorList[item.colorIndex]}`"
                     class="menu-item-layout" :class="{ 'item-selected': item.id === currentId, 'status-active': index === activeIndex}"
                     @click="onItemClicked(item)"
                     draggable="true"
                     @drag="onDrag($event)"
                     @dragstart="onDragStart($event, item, index)"
                     @dragover.prevent="onDragOver($event, item, index)"
                     @dragenter.prevent="onDragEnter($event, item, index)"
                     @dragleave="onDragLeave($event, index)"
                     @dragend="onDragEnd($event, index)"
                     @contextmenu.stop.prevent="onMouseRightClick($event, item, index)" />
          <div class="indicator bottom-indicator">
            <div class="indicator-circle"></div>
            <div class="indicator-line"></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <context-menu :menu-list="menuList" ref="contextMenu"
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
<script>
import TypeItem from "@/components/menu/TypeItem.vue";
import { TYPE_COLOR_LIST } from "@/components/menu/TypeDialogLayout.vue";
import { MUTATION_SET_INCREMENT_ID } from "@/store/modules/type";
import ContextMenu from "@/components/common/ContextMenu.vue";

// 这里和.menu-item-layout的高度保持同步
const MENU_ITEM_HEIGHT = 36

export default {
  name: "TypeListLayout",
  props: {
    indexId: {
      type: Number,
      default: -1
    }
  },
  emits: ['rightClickItem'],
  components: {
    TypeItem,
    ContextMenu,
  },
  data() {
    return {
      list: [
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
      ],
      colorList: TYPE_COLOR_LIST,
      currentId: this.indexId,
      isSelected: true, // 要么是选中、失去焦点
      isDraggingOut: true,
      isDragging: false,
      overIndex: -2,
      activeIndex: -2,

      menuRect: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      listLayout: {
        bottom: 0
      },
      menuList: [
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
      ],
      dialog: {
        showDeleteDialog: false,
        title: ''
      },
    }
  },
  mounted() {
    this.initMenuRect()
    this.$store.commit(MUTATION_SET_INCREMENT_ID, 100)
  },

  methods: {
    initMenuRect() {
      let menuListRect = this.$refs.menuList.getBoundingClientRect()
      let { top, bottom, left, right } = menuListRect
      this.menuRect = { top, bottom, left, right }
      let layoutRect = this.$refs.listLayout.getBoundingClientRect()
      this.listLayout.bottom = layoutRect.bottom
    },

    onItemClicked(item) {
      this.currentId = item.id
    },
    onDragStart(ev, item, index) {
      this.isDragging = true
      console.log('----start drag', index)
    },
    onDragOver(event, item, index) {
      this.overIndex = index
      let ratio = event.offsetY / MENU_ITEM_HEIGHT
      if (ratio < 1 / 4) {
        this.overIndex = index - 1
      } else if (ratio <= 3 / 4) {
        // todo
        this.overIndex = -2
      } else {
        this.overIndex = index
      }
    },
    onDragEnter() {
      // console.log('enter---x', event, item, index)
    },
    onDragEnd(event, index) {
      this.isDragging = false
      this.isDraggingOut = true
      console.log('----drag end', event, index, this.overIndex)
      if (this.overIndex === -2) {
        return
      }
      // 要移动的item
      const moveIndex = index
      // 要插入的位置
      let insertIndex = this.overIndex
      if (moveIndex !== insertIndex) {
        const moveItem = this.list[moveIndex]
        this.list.splice(moveIndex, 1);
        if (moveIndex > insertIndex) {
          insertIndex++
        }
        this.list.splice(insertIndex, 0, moveItem);
      }
      this.isDragging = false
      this.isDraggingOut = true
      this.overIndex = -2
    },
    onDragLeave() {
      // this.isDragging = false
      // console.log('leave---x', index)
    },
    onDrag(ev) {
      let { clientX, clientY } = ev
      if (clientX === 0 && clientY === 0) {
        return;
      }
      if (clientX < this.menuRect.left || clientX > this.menuRect.right) {
        this.overIndex = -2
        this.isDraggingOut = true
        return
      }
      if (clientY < this.menuRect.top - MENU_ITEM_HEIGHT / 4) {
        this.overIndex = -2
        this.isDraggingOut = true
        return
      }
      if (clientY > this.listLayout.bottom) {
        this.overIndex = -2
        this.isDraggingOut = true
        return
      }
      this.isDraggingOut = false
      if (clientY > this.menuRect.bottom) {
        // 最底下
        this.overIndex = this.list.length - 1
      }
    },

    isShowIndicator(index) {
      if (!this.isDragging || this.isDraggingOut) {
        // 不再滑动、或者滑出列表
        return false
      }
      return index === this.overIndex
    },

    changeStatus(isSelected, currentId) {
      this.isSelected = isSelected
      if (currentId !== undefined) {
        this.currentId = currentId
      }
    },

    addType(item) {
      this.list.push(item)
      this.$nextTick(() => {
        this.currentId = item.id
        const scrollList = this.$refs.listLayout
        scrollList.scrollTo({
          top: scrollList.scrollHeight,
          behavior: 'smooth'
        })
      })
    },

    modifyItem(newItem) {
      const oldIndex = this.list.findIndex(item => item.id === newItem.id)
      if (oldIndex !== -1) {
        this.list[oldIndex] = newItem
        this.currentId = newItem.id
      }
    },

    onMouseRightClick(ev, item, index) {
      this.activeIndex = index
      this.$refs.contextMenu.showContextMenu(ev.clientX, ev.clientY)
    },

    onContextMenuClosed(index, subIndex) {
      console.log('---onContextMenuClosed', index, subIndex)

      if (subIndex !== undefined) {
        // 点击sub-menu
      } else if (index !== undefined) {
        // 点击menu
        const type = this.menuList[index].type

        if (type === 'delete') {
          let typeItem = this.list[this.activeIndex]
          // this.list.splice(this.activeIndex, 1)
          if (typeItem.count > 0) {
            this.dialog.showDeleteDialog = true
            this.dialog.title = typeItem.name
            return
          } else {
            this.list.splice(this.activeIndex, 1)
          }
        } else if (type === 'showType') {
          let typeItem = this.list[this.activeIndex]
          this.$emit('rightClickItem', { typeItem, type, index, subIndex })
        }
      }
      // 把右键选中状态置空
      this.activeIndex = -1
    },

    onDelTypeDialogMiss(yes) {
      console.log('---y', yes)
      this.dialog.showDeleteDialog = false
      const deleteIndex = this.activeIndex
      this.activeIndex = -1
      if (yes) {
        this.$nextTick(() => {
          this.list.splice(deleteIndex, 1)
        })
      }
    }


  }
}
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