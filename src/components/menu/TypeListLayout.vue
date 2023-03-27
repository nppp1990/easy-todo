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
                     class="menu-item-layout" :class="{ 'item-selected': item.id === currentId}"
                     @click="onItemClicked(item)"
                     draggable="true"
                     @drag="onDrag($event)"
                     @dragstart="onDragStart($event, item, index)"
                     @dragover.prevent="onDragOver($event, item, index)"
                     @dragenter.prevent="onDragEnter($event, item, index)"
                     @dragleave="onDragLeave($event, index)"
                     @dragend="onDragEnd($event, index)" />
          <div class="indicator bottom-indicator">
            <div class="indicator-circle"></div>
            <div class="indicator-line"></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script>
import TypeItem from "@/components/menu/TypeItem.vue";

export default {
  name: "TypeListLayout",
  props: {
    indexId: {
      type: Number,
      default: -1
    }
  },
  components: {
    TypeItem,
  },
  data() {
    return {
      list: [
        { color: 1, name: 'name1', count: 2, id: 1 },
        { color: 2, name: 'name2', count: 0, id: 2 },
        { color: 4, name: 'name3', count: 1, id: 3 },
        { color: 1, name: 'name4', count: 4, id: 4 },
        { color: 1, name: 'name5', count: 4, id: 5 },
        { color: 1, name: 'name6', count: 4, id: 6 },
        { color: 1, name: 'xxx', count: 4, id: 7 },
        // { color: 1, name: 'name4', count: 4, id: 8 },
        // { color: 1, name: 'name4', count: 4, id: 9 },
        // { color: 1, name: 'name4', count: 4, id: 10 },
        // { color: 1, name: 'name4', count: 4, id: 11 },
        // { color: 1, name: 'name4', count: 4, id: 12 },
        // { color: 1, name: 'name4', count: 6, id: 12 },
        // { color: 1, name: 'name4', count: 7, id: 12 },
        // { color: 1, name: 'name4', count: 8, id: 12 },
        // { color: 1, name: 'name4', count: 10, id: 12 },
      ],
      currentId: this.indexId,
      isSelected: true, // 要么是选中、失去焦点


      isDraggingOut: true,
      isDragging: false,
      overIndex: -2,

      menuRect: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      listLayout: {
        bottom: 0
      }
    }
  },
  mounted() {
    let menuListRect = this.$refs.menuList.getBoundingClientRect()
    let { top, bottom, left, right } = menuListRect
    this.menuRect = { top, bottom, left, right }
    let layoutRect = this.$refs.listLayout.getBoundingClientRect()
    this.listLayout.bottom = layoutRect.bottom
  },
  methods: {
    onItemClicked(item) {
      this.currentId = item.id
    },
    onDragStart(ev, item, index) {
      this.isDragging = true
      console.log('----start drag', index)
    },
    onDragOver(event, item, index) {
      this.overIndex = index
      let itemRef = this.$refs.items[index]
      let rect = itemRef.getBoundingClientRect()
      let offset = event.clientY - rect.top
      let ratio = offset / rect.height
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
      if (clientY < this.menuRect.top - 20) {
        // todo 20应该是根据item的高度计算
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
    }
  }
}
</script>
<style scoped lang="scss">
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