<template>
  <div class="context-root context-root-bg" ref="root" v-click-outside="onClickOutside"
       :style="{left : position.x + 'px', top: position.y + 'px', display: show ? 'block':'none'}">
    <template v-for="(item, index) in menuList" :key="index">
      <div v-if="item === -1" class="context-divider" />
      <div v-else class="context-item" @mouseenter="showSubMenu($event, index)">
        <template v-if="item.subMenu && item.subMenu.length > 0">
          <span>{{ item.value }}</span>
          <div class="context-arrow" />
          <div class="context-sub context-root-bg" :style="{top: subStyleList[index].top + 'px', left: subStyleList[index].left + 'px'}">
            <div v-for="(sub, subIndex) in item.subMenu" :key="subIndex" class="context-item context-sub-item"
                 @click="onClickSubmenuItem(index, subIndex)">
              <span>{{ sub.value }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <span @click="onClickMenuItem(index)">{{ item.value }}</span>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
// menu离body最近的距离
const MIN_WINDOW_MARGIN = 10
const TAG_YES = '✓ '

export default {
  name: "ContextMenu",

  props: {
    menuList: {
      type: Array,
      required: true
    }
  },

  emits: ['menuDismiss'],

  data() {
    return {
      subStyleList: [],
      position: {
        x: 0,
        y: 0
      },
      show: false,
    }
  },
  created() {
    for (let i = 0; i < this.menuList.length; i++) {
      const menuItem = this.menuList[i]
      if (menuItem.subMenu && menuItem.subMenu.length > 0) {
        this.subStyleList[i] = {
          top: -5,
          left: 195
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    showSubMenu(ev, index) {
      // todo: 精准点应该是根据当前的位置来计算top还不是对top递增递减
      let subStyle = this.subStyleList[index]
      let itemLayout = ev.target
      let subLayout = itemLayout.querySelector('.context-sub')
      if (subLayout) {
        let subRect = subLayout.getBoundingClientRect()
        let { offsetWidth: bodyWidth, offsetHeight: bodyHeight } = document.body
        if (subRect.bottom + MIN_WINDOW_MARGIN > bodyHeight) {
          if (subRect.height - MIN_WINDOW_MARGIN > bodyHeight) {
            // 如果subMenu太大，保证上面能看到
            let itemRect = itemLayout.getBoundingClientRect()
            subStyle.top = MIN_WINDOW_MARGIN - itemRect.top
          } else {
            // subMenu太靠下了，需要上移
            subStyle.top -= (subRect.bottom + MIN_WINDOW_MARGIN - bodyHeight)
          }
        }

        if (subRect.right + MIN_WINDOW_MARGIN > bodyWidth) {
          let itemRect = itemLayout.getBoundingClientRect()
          subStyle.left = -itemRect.width
        }
      }
    },

    showContextMenu(x = 0, y = 0) {
      this.show = true
      this.$nextTick(() => {
        // 暂时只调整y值
        let height = this.$refs.root.offsetHeight
        let bodyHeight = document.body.offsetHeight
        if (y + height + MIN_WINDOW_MARGIN > bodyHeight) {
          y = bodyHeight - height - MIN_WINDOW_MARGIN
        }
        // todo：这里右键以后还会触发outside，导致show=false，所以改一点点x、y值、防止触发outside
        this.position = { x: x - 2, y: y - 2 }
      })

    },

    hide() {
      this.show = false
    },

    onClickMenuItem(index) {
      this.hide()
      this.$emit('menuDismiss', index)
    },
    onClickSubmenuItem(index, subIndex) {
      this.hide()
      this.$emit('menuDismiss', index, subIndex)
    },
    onClickOutside() {
      if (!this.show) {
        return
      }
      this.$emit('menuDismiss')
      this.hide()
    }
  }

}
</script>
<style scoped lang="scss">
.context-root-bg {
  padding: 5px 4px;
  background-color: #e1e1e1;
  border: 1px solid #c3c3c3;
  border-radius: 6px;
  box-shadow: 0 0 5px #d6d6d6;
}

div.context-root {
  width: 205px;
  position: fixed;
  z-index: 1000;
  //left: 250px;
  //top: 50px;

  .context-item {
    height: 21px;
    padding: 0 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    color: var(--todo-black2);
    font-size: 13px;

    span {
      overflow: hidden;
      flex: 1;
    }

    .context-arrow {
      width: 7px;
      height: 7px;
      border-style: solid;
      border-color: var(--todo-black2);
      border-width: 2px 2px 0 0;

      transform: rotate(45deg);
      background-color: transparent;
    }

    .context-sub {
      display: none;
      max-width: 134px;
      position: absolute;
      font-size: 13px;

      .context-sub-item {
        white-space: nowrap;
      }
    }

  }

  .context-item:hover {
    background-color: #58a6f8;
    color: white;

    .context-arrow {
      border-color: white;
    }

    .context-sub {
      display: block;
    }
  }

  .context-divider {
    background-color: #d2d2d2;
    width: calc(100% - 12px);
    height: 1px;
    margin: 6px;
  }

}
</style>