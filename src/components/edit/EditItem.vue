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
      <input class="name" type="text" v-model="name" @click.stop="onClickSpan">
      <!--      <div v-show="!showExtra">testXXXX</div>-->
      <el-collapse-transition>
        <div style="display: flex; flex-direction: column" v-show="showExtra">
          <input class="remark" type="text" placeholder="备注" @click.stop="onClickSpan" v-model="note">
          <!--          <input type="text" placeholder="添加标签" v-model="testLabel">-->
          <div class="other-info">
            <todo-date-picker v-model="date" />
            <todo-time-picker class="label-right" v-model="timer"
                              :style="`display: ${date.length > 0 ? 'block' : 'none'} `" />
            <div class="label-layout label label-right">#</div>
            <div class="label-layout flag label-right" @click="isFlag = !isFlag">
              <img :src="`src/assets/svg/ic_flag${isFlag ? '_selected' : ''}.svg`" alt="">
            </div>
          </div>
        </div>
      </el-collapse-transition>
      <template v-if="!showExtra">
        <input v-show="note.length > 0"
               :value="note" class="remark" type="text" placeholder="备注" @click.stop="onClickSpan">
        <span v-show="date.length > 0" class="extra_content" @click.stop="onClickSpan">{{ extraContent }}</span>
        <!--        <input v-if="testLabel.length > 0"-->
        <!--               :value="testLabel" type="text" placeholder="添加标签"  @click.stop="onClickSpan">-->
      </template>
      <div class="divider" />
    </div>
  </div>
</template>
<script setup>
import TodoDatePicker from "@/components/edit/TodoDatePicker.vue";
import TodoTimePicker from "@/components/edit/TodoTimePicker.vue";
import { defineAttrFromProps } from "@/utils/vueUtils";
import { computed } from "vue";
import { getDateStr } from "@/utils/timeUtils";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  timer: {
    type: String,
    default: ''
  },
  isFlag: {
    type: Boolean,
    default: false,
  },
  showExtra: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits([
  'update:name',
  'update:note',
  'update:date',
  'update:timer',
  'update:isFlag',
  'update:showExtra',
  'itemChange'
])

function defineAttr(key, notifyChange = true) {
  return defineAttrFromProps(props, emit, key, notifyChange ? 'itemChange' : null)
}

const name = defineAttr('name')
const note = defineAttr('note')
const date = defineAttr('date')
const timer = defineAttr('timer')
const isFlag = defineAttr('isFlag')
const showExtra = defineAttr('showExtra', false)

const extraContent = computed(() => {
  let dateStr = getDateStr(date.value)
  if (!dateStr) {
    dateStr = date.value
  }
  if (timer.value.length > 0) {
    return dateStr + ' ' + timer.value
  }
  return dateStr
})

function onClickSpan() {
  showExtra.value = true
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
    font-size: 13px;

    input {
      display: inline-block;
      background: none;
      border: none;
      outline: none;
      height: 18px;
      font-size: inherit;
      color: var(--todo-black1);

      &::placeholder {
        font-size: inherit;
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
      font-size: inherit;

      .label-layout {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 22px;
        padding: 0 6px;
        background-color: var(--todo-bg-label);
        border-radius: 4px;
        color: #2C3E50;

        &.label {
          color: var(--el-input-placeholder-color);
        }

        &.flag {
          padding: 0 3px;

          img {
            width: 14px;
            height: 14px;
          }
        }
      }


      .label-right {
        margin-left: 8px;
      }
    }

    .extra_content {
      height: 18px;
      font-size: inherit;
      color: var(--el-text-color-placeholder);
    }

    .divider {
      height: 1px;
      width: 100%;
      background-color: var(--divider-gray2);
      margin-top: 6px;
    }
  }


}
</style>