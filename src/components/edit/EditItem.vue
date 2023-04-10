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
      <input class="name" type="text" value="name" @click="test2">
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
        <todo-date-picker class="label-right" v-model="test" />
        <todo-time-picker class="label-right" v-model="testTimer"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import TodoDatePicker from "@/components/edit/TodoDatePicker.vue";
import { ref } from "vue";
import TodoTimePicker from "@/components/edit/TodoTimePicker.vue";

const test = ref('2022/01/03')
const testTimer = ref('12:03')

const test2 = () => {
  console.log(test.value)
}
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