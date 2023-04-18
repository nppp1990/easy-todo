<template>
  <div class="edit-item-root" ref="refItem">
    <label class="radio">
      <input type="checkbox" v-model="cacheData.done">
      <div class="checkmark" />
    </label>
    <div class="info-layout">
      <input class="input-item name" type="text" v-model="cacheData.name" ref="refNameInput"
             @click.stop="onClickSpan"
             @keydown.enter="onNameInputEnter($event)">
      <el-collapse-transition>
        <div v-show="showExtra || note.length > 0">
          <el-input class="remark" type="textarea" placeholder="备注"
                    :autosize="{ minRows: 1, maxRows: 5 }"
                    @click.stop="onClickSpan" v-model="cacheData.note" ref="refNoteInput">
          </el-input>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div v-if="showExtra" class="other-info">
          <todo-date-picker v-model="cacheData.date" />
          <todo-time-picker class="label-right" v-model="cacheData.timer"
                            :style="`display: ${date ? 'block' : 'none'} `" />
          <div class="label-layout label label-right">#</div>
          <div class="label-layout flag label-right" @click="cacheData.sFlag = !cacheData.isFlag">
            <img :src="`src/assets/svg/ic_flag${isFlag ? '_selected' : ''}.svg`" alt="">
          </div>
        </div>
      </el-collapse-transition>
      <template v-if="!showExtra">
        <div class="extra_content">
          <span v-if="extraTypeName">{{ extraTypeName }}</span>
          <span v-if="extraTime" :class="extraContentClass" @click.stop="onClickSpan">{{ extraTime }}</span>
        </div>
      </template>
      <div class="divider" />
    </div>
  </div>
</template>
<script setup>
import TodoDatePicker from "@/components/edit/TodoDatePicker.vue";
import TodoTimePicker from "@/components/edit/TodoTimePicker.vue";
import { defineAttrFromProps } from "@/utils/vueUtils";
import { computed, reactive, ref, watch } from "vue";
import { getSpecialDateStr, isExpire } from "@/utils/timeUtils";

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
  done: {
    type: Boolean,
    default: false,
  },
  showExtra: {
    type: Boolean,
    default: false,
  },
  typeName: {
    type: String,
    default: '',
  }
})
const emit = defineEmits([
  'update:name',
  'update:note',
  'update:date',
  'update:timer',
  'update:isFlag',
  'update:done',
  'update:showExtra',
  'itemChange'
])

function defineAttr(key, notifyChange = true) {
  return defineAttrFromProps(props, emit, key, notifyChange ? 'itemChange' : null)
}

const cacheData = reactive({
  name: props.name,
  note: props.note,
  date: props.date,
  timer: props.timer,
  isFlag: props.isFlag,
  done: props.done
})

watch(() => cacheData.done, (done) => {
  if (!showExtra.value) {
    emit('update:done', done)
  }
})
// const name = defineAttr('name')
// const note = defineAttr('note')
// const date = defineAttr('date')
// const timer = defineAttr('timer')
// const isFlag = defineAttr('isFlag')
// const isDone = defineAttr('done')

const refNameInput = ref(null)
const refNoteInput = ref(null)
const showExtra = defineAttr('showExtra', false)

watch(() => props.showExtra, (show) => {
  if (show) {
    if (!isFocused()) {
      // 只有当前todoItem、没有焦点时才聚焦到name
      refNameInput.value.focus()
    }
  } else {
    for (const key in cacheData) {
      if (props[key] === cacheData[key]) {
        continue
      }
      emit('update:' + key, cacheData[key])
    }
  }
})


/**
 * 当前todoItem是否有焦点
 * @returns {boolean}
 */
function isFocused() {
  let activeElement = document.activeElement
  return activeElement && (refNoteInput.value.ref === activeElement || refNameInput.value === activeElement)
}

const extraTypeName = computed(() => {
  if (!props.typeName) {
    return ''
  }
  if (cacheData.name) {
    return props.typeName + ' - '
  } else {
    return props.typeName
  }
})

const extraTime = computed(() => {
  if (!cacheData.date) {
    return ''
  }
  let dateStr = getSpecialDateStr(cacheData.date)
  if (!dateStr) {
    dateStr = cacheData.date
  }
  if (cacheData.timer) {
    return dateStr + ' ' + cacheData.timer
  }
  return dateStr
})

const extraContentClass = computed(() => {
  let expire = isExpire(cacheData.date, cacheData.timer)
  return { expire }
})

function onClickSpan() {
  showExtra.value = true
}

function onNameInputEnter(ev) {
  if (ev.isComposing) {
    return
  }
  showExtra.value = false
}

const refItem = ref(null)
defineExpose({
  getItemElement: function() {
    return refItem.value
  }
})
</script>
<style scoped lang="scss">
.edit-item-root {
  display: flex;

  .radio {
    margin: 7px 16px 0;
    position: relative;
    cursor: pointer;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    user-select: none;
    border: 1px solid var(--todo-blue);
    display: block;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      &:after {
        content: '';
        position: absolute;
        top: 20%;
        left: 20%;
        background-color: var(--todo-blue);
        width: 60%;
        height: 60%;
        border-radius: 50%;
        transform: scale(0);
        transition: 100ms ease;
      }
    }
  }

  .radio input:checked ~ .checkmark:after {
    transform: scale(1);
  }

  .info-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 13px;

    .input-item, :deep(.el-textarea__inner) {
      display: inline-block;
      background: none;
      border: none;
      outline: none;
      line-height: 18px;
      width: 100%;
      font-size: inherit;
      padding: 0;

      &::placeholder {
        font-size: inherit;
        color: var(--todo-gray2);
        border: none;
        outline: none;
        box-shadow: none;
      }

      &.name {
        color: var(--todo-black1);
        height: 18px;
        margin-top: 7px;
      }
    }

    :deep(.el-textarea__inner) {
      color: var(--todo-gray4);
      resize: none;
      box-shadow: none;
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

      .expire {
        color: #fb4743;
      }
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