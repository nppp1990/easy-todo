<template>
  <div class="timer-input">
    <img :src="`src/assets/svg/ic_clock_${isActive?'':'un'}selected.svg`" class="icon" alt="">
    <el-popover placement="bottom" width="160" trigger="focus" v-model:visible="showTipList"
                :hide-after="50">
      <template #reference>
        <input type="text" class="value" placeholder="添加时间"
               v-model="currentValue"
               @focus="isActive = true"
               @blur="onBlur"
               @change="onTextChange"
               @input="onInput"
               @click="showTipList = true"
               @keydown="inputKeyDown($event)">
      </template>
      <div class="timer-tip-layout" @mouseleave="activeIndex = -1">
        <h5>建议</h5>
        <div class="tip-item-layout" v-for="(item, index) in tipList" :key="index"
             :class="{'item-selected': index === activeIndex}"
             @mouseover="activeIndex = index"
             @click="onClickTimeItem(item, index)">
          <img :src="`src/assets/svg/ic_clock2_${activeIndex === index ? '' : 'un'}selected.svg`" alt="">
          <div>
            <span class="time">{{ item.time }}</span>
            <span class="desc">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </el-popover>
    <img src="src/assets/svg/ic_delete.svg" alt="" class="del_icon" @click="clearTime">
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";

const TIP_TEMPLATE = [
  { time: '09:00', desc: '上午' },
  { time: '12:00', desc: '中午' },
  { time: '15:00', desc: '下午' },
  { time: '18:00', desc: '晚上' },
  { time: '21:00', desc: '夜间' }
]

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const currentValue = ref(props.modelValue)
const actualValue = computed({
  get() {
    return props.modelValue
  },

  set(value) {
    currentValue.value = value
    emit('update:modelValue', value)
  }
})
const tipList = ref([])
const activeIndex = ref(-1)
// 一开始为推荐时间
tipList.value.push(...TIP_TEMPLATE)

function resetTipList() {
  tipList.value = [...TIP_TEMPLATE]
}

// tipList.value = [{ time: '09:01', desc: '自定义' }]

function onTextChange() {
  let value = currentValue.value
  // 去掉空格
  value = value.replaceAll(' ', '')
  if (dayjs(value, 'H:mm', true).isValid()) {
    actualValue.value = value
  } else {
    // 不合法则把当前value还原
    currentValue.value = actualValue.value
  }
}

function onInput() {
  let value = currentValue.value.replaceAll(' ', '')
  // 搞个简单的正则 todo 这里应该可以更好的，简单写吧
  let pattern = /^([0-1][0-9]|2[0-4]|[0-9]):([0-5][0-9]|[0-9])$/
  console.log('----', pattern.test(value))

  showTipList.value = true
  if (pattern.test(value)) {
    let hour = value.split(':')[0]
    let minute = value.split(':')[1]
    if (hour.length === 1) {
      hour = '0' + hour
    }
    if (minute.length === 1) {
      minute = '0' + minute
    }
    tipList.value = [{ time: hour + ':' + minute, desc: '自定义' }]
  } else {
    resetTipList()
  }
}

function clearTime() {
  actualValue.value = ''
  resetTipList()
}

const showTipList = ref(false)
watch(showTipList, (show) => {
  // 只要showTip发生变化，index就变为-1
  if (show) {
    activeIndex.value = -1
  }
})

function onClickTimeItem(item) {
  showTipList.value = false
  actualValue.value = item.time
}

function inputKeyDown(ev) {
  if (ev.isComposing) {
    return
  }
  if (ev.key === 'ArrowDown') {
    if (activeIndex.value < tipList.value.length - 1) {
      activeIndex.value++
    }
  } else if (ev.key === 'ArrowUp') {
    if (activeIndex.value > 0) {
      activeIndex.value--
    }
  } else if (ev.keyCode === 27) {
    showTipList.value = false
  } else if (ev.key === 'Enter') {
    if (activeIndex.value >= 0) {
      const item = tipList.value[activeIndex.value]
      actualValue.value = item.time
    }
  }
}

const isActive = ref(false)

function onBlur() {
  isActive.value = false
}
</script>
<style scoped lang="scss">
.timer-input {
  display: flex;
  align-items: center;
  background-color: var(--todo-bg-label);
  border-radius: 4px;

  .icon {
    width: 10px;
    height: 10px;
    margin: 0 6px;
  }

  input {
    background: none;
    border: none;
    outline: none;
    display: inline-block;
    width: 60px;
    height: 22px;
    font-size: inherit;
    color: var(--todo-black1);

    &::placeholder {
      font-size: inherit;
      color: var(--el-text-color-placeholder);
    }

    & + .del_icon {
      width: 10px;
      height: 10px;
      margin: 0 6px;
      visibility: hidden;
    }
  }

  &:hover {
    input:placeholder-shown + .del_icon {
      visibility: hidden;
    }

    .del_icon {
      visibility: visible;
    }
  }
}

.timer-tip-layout {
  display: flex;
  flex-direction: column;

  h5 {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 4px;
    margin-left: 6px;
  }

  .tip-item-layout {
    display: flex;
    align-items: center;
    height: 36px;
    border-radius: 4px;

    &.item-selected {
      background-color: var(--todo-bg-blue-selected);

      .time {
        color: white;
      }

      .desc {
        color: #eeeeee;
      }
    }

    img {
      margin-left: 8px;
      margin-right: 8px;
      width: 14px;
      height: 14px;
    }

    span {
      display: block;
      font-size: 12px;
      line-height: 16px;
      cursor: default;
    }

    .time {
      color: var(--todo-black1);
    }

    .desc {
      color: var(--todo-black3);
    }

  }
}
</style>