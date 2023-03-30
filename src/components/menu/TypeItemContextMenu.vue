<template>
  <div class="context-root context-root-bg">
    <div class="context-item">1</div>
    <div class="context-item" @mouseenter="test($event)">
      <span>2</span>
      <div class="context-arrow" />
      <div class="context-sub-item context-root-bg" :style="{top: style.top + 'px', right: style.right + 'px'}" ref="subLayout">
        <div class="context-item">sub1</div>
        <div class="context-item">sub2</div>
        <div class="context-item">sub2</div>
        <div class="context-item">sub2</div>
        <div class="context-item">sub2</div>
        <div class="context-item">sub2</div>
        <div class="context-item">subX</div>
        <div class="context-item">subX</div>
      </div>
    </div>
    <div class="context-divider"></div>
    <div class="context-item">3</div>
    <div class="context-item">4</div>
    <div class="context-item">5</div>
  </div>
</template>
<script>
// menu离body最近的距离
const MIN_WINDOW_MARGIN = 10

export default {
  name: "TypeItemContextMenu",

  data() {
    return {
      style: {
        top: -5,
        right: -134
      }
    }
  },

  mounted() {
    let rect = this.$refs.subLayout.getBoundingClientRect();
    console.log('--mounted', rect)
  },
  methods: {
    test(ev) {
      // todo: 精准点应该是根据当前的位置来计算top还不是对top递增递减
      let itemLayout = ev.target
      let subLayout = itemLayout.querySelector('.context-sub-item')
      if (subLayout) {
        let subRect = subLayout.getBoundingClientRect()
        let { offsetWidth: bodyWidth, offsetHeight: bodyHeight } = document.body
        console.log(bodyWidth, bodyHeight)

        if (subRect.bottom + MIN_WINDOW_MARGIN > bodyHeight) {
          if (subRect.height - MIN_WINDOW_MARGIN > bodyHeight) {
            // 如果subMenu太大，保证上面能看到
            let itemRect = itemLayout.getBoundingClientRect()
            this.style.top = MIN_WINDOW_MARGIN - itemRect.top
          } else {
            // subMenu太靠下了，需要上移
            this.style.top -= (subRect.bottom + MIN_WINDOW_MARGIN - bodyHeight)
          }
        }

        if (subRect.right + MIN_WINDOW_MARGIN > bodyWidth) {
          let itemRect = itemLayout.getBoundingClientRect()
          this.style.right = itemRect.width
        }


      }

      let rect1 = this.$refs.subLayout.getBoundingClientRect();
      // this.style.top = '-0px'


      let rect2 = ev.target.getBoundingClientRect()
      console.log(ev.target.querySelector('.context-sub-item'))
      console.log(rect1, rect2)

      // console.log('---over', rect, ev.target, ev.target, document.body.clientHeight, document.body.offsetHeight)

    }
  }


}
</script>
<style scoped lang="scss">
.context-root-bg {
  padding: 5px 4px;
  background-color: #e1e1e1;
  border: 1px solid #c3c3c3;
  border-radius: 4px;
  box-shadow: 0 0 5px #d6d6d6;
}

div.context-root {
  width: 205px;

  .context-item {
    height: 21px;
    padding: 0 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    color: var(--todo-black2);

    span {
      font-size: 14px;
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

    .context-sub-item {
      display: none;
      width: 134px;
      position: absolute;
      //right: -134px;
      //top: -10;
      //bottom: 0;
      font-size: 14px;
    }

  }

  .context-item:hover {
    background-color: #58a6f8;
    color: white;

    .context-arrow {
      border-color: white;
    }

    .context-sub-item {
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