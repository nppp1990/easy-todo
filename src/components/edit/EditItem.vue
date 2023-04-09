<template>
  <div class="edit-item-root">
    <div class="radio">
      <input type="checkbox" id="cbx" style="display: none;">
      <label for="cbx" class="check">
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
          <polyline points="1 9 7 14 15 4"></polyline>
        </svg>
      </label>
    </div>
    <div class="info-layout">
      <input class="name" type="text" value="name">
      <input class="remark" type="text" placeholder="备注">
      <input type="text" placeholder="添加标签">
      <div class="other-info">
        <div class="label input-wrapper">
          <img src="src/assets/svg/ic_calendar_selected.svg" class="icon" alt="">
          <input type="text" class="value" placeholder="添加日期">
          <img src="src/assets/svg/ic_delete.svg" class="del_icon_show" alt="">
        </div>
        <div class="label label-right input-wrapper">
          <img src="src/assets/svg/ic_clock_selected.svg" class="icon" alt="">
          <input type="text" class="value" placeholder="添加时间">
          <img src="src/assets/svg/ic_delete.svg" class="del_icon_show" alt="">
        </div>
        <todo-date-picker class="label-right" />
      </div>
    </div>
  </div>
</template>
<script setup>
// const value1 = ref('')
// const dataPicker = ref(null)
// const test = ref(false)

// const vPickFormat = {
//   mounted(el, binding, vnode, prevVnode) {
//     // console.log('-----', el, binding, vnode, prevVnode)
//     // const $this = $($(el).children('input')[0])
//     const inputs = el.getElementsByTagName('input')
//     if (inputs) {
//       const input = inputs[0]
//       const { ctx: that, data } = vnode
//       input.addEventListener('change', (res)=>{
//         console.log('---', res)
//         let inputValue = input.value.trim()
//         if (inputValue === '今天') {
//           value1.value = dayjs().format()
//           dataPicker.value.handleClose()
//           return
//         }
//         if (inputValue === '明天') {
//           value1.value = dayjs().add(1, 'day').format()
//           dataPicker.value.handleClose()
//           return
//         }
//         if (inputValue === '昨天') {
//           value1.value = dayjs().add(-1, 'day').format()
//           dataPicker.value.handleClose()
//         }
//       })
//       // input.addEventListener('keyup', (v)=>{
//       //   console.log('-----xxx', v)
//       //   if (v.code === 'Enter') {
//       //
//       //     value1.value = '2023/04/05'
//       //   }
//       // })
//     }
//   },
// }
//
// const dataPrefix = computed(() => {
//   console.log('-----', test.value)
//   return h('img', {
//     src: `src/assets/svg/ic_calendar_${ test.value ? '' : 'un' }selected.svg`,
//     class: "icon",
//     alt: ""
//   })
// })
//
// const dateFormat = computed(() => {
//   const curDate = dayjs(value1.value, 'YYYY-MM-DD')
//   if (curDate.isToday()) {
//     return '今天'
//   }
//   if (curDate.isYesterday()) {
//     return '昨天'
//   }
//
//   if (curDate.isTomorrow()) {
//     return '明天'
//   }
//   return 'YYYY/MM/DD'
// })
// const testC = () => {
//   test.value = false
//   console.log('----val', value1.value)
// }
import TodoDatePicker from "@/components/edit/TodoDatePicker.vue";
</script>
<style scoped lang="scss">
.edit-item-root {
  display: flex;

  .radio {
    margin: 8.5px 16px 0;

    .check {
      cursor: pointer;
      position: relative;
      margin: auto;
      width: 18px;
      height: 18px;
      -webkit-tap-highlight-color: transparent;
      transform: translate3d(0, 0, 0);

      &:before {
        content: "";
        position: absolute;
        top: -12px;
        left: -8px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(34, 50, 84, 0.03);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      svg {
        position: relative;
        z-index: 1;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: #c6c6c6;
        stroke-width: 1.5;
        transform: translate3d(0, 0, 0);
        transition: all 0.2s ease;

        path {
          stroke-dasharray: 60;
          stroke-dashoffset: 0;
        }

        polyline {
          stroke-dasharray: 22;
          stroke-dashoffset: 66;
        }
      }

      &:hover:before {
        opacity: 1;
      }

      &:hover svg {
        stroke: var(--accent-color, #a3e583);
      }
    }

    input:checked + .check svg {
      stroke: var(--accent-color, #a3e583);

      path {
        stroke-dashoffset: 60;
        transition: all 0.3s linear;
      }

      polyline {
        stroke-dashoffset: 42;
        transition: all 0.2s linear;
        transition-delay: 0.15s;
      }
    }
  }

  .info-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 12px;

    & > input {
      display: inline-block;
      background: none;
      border: none;
      outline: none;
      height: 18px;
      font-size: 13px;
      color: var(--todo-black1);

      &::placeholder {
        font-size: 13px;
        color: var(--todo-gray2);
      }

      &.name {
        margin-top: 7px;
      }

      &.remark {
        color: var(--todo-gray4);
      }
    }

    .other-info {
      margin-top: 2px;
      height: 22px;
      display: flex;

      .label {
        height: 100%;
      }

      .label-right {
        margin-left: 8px;
      }

      .label.input-wrapper {
        display: flex;
        align-items: center;
        background-color: #f5f5f5;
        border-radius: 4px;

        .icon {
          width: 8px;
          height: 8px;
          margin: 0 6px;
        }

        .del_icon_show {
          width: 12px;
          height: 12px;
          margin: 0 6px;
        }

        .value {
          background: none;
          border: none;
          outline: none;
          display: inline-block;
          width: 60px;
          height: 20px;
          font-size: 13px;
          color: var(--todo-black1);

          &::placeholder {
            font-size: 13px;
            color: var(--todo-gray4);
          }

          &:placeholder-shown + .del_icon_show {

            visibility: hidden;
          }
        }
      }
    }
  }
}
</style>