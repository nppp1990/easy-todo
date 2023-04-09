<template>
  <form class="dialog-layout" @submit.prevent="onSubmit">
    <h4>{{ title }}</h4>
    <div class="name-layout">
      <span>名称：</span>
      <input type="text" v-model="typeName" ref="nameInput">
    </div>
    <div class="label-layout">
      <div class="color-layout">
        <span>颜色：</span>
        <div class="color-grid">
          <div v-for="i in colorList.length" class="circle-color" :key="i" :style="`background-color: ${colorList[i - 1]}`"
               @click="onClickColorItem(i - 1)">
            <div v-show="i - 1 === currentColorIndex" class="select-dot"></div>
          </div>
        </div>
      </div>
      <div class="divider" />
      <div class="icon-layout">
        <span>图标：</span>
        <el-popover placement="right" :width="274" trigger="click" :visible="showIconList">
          <template #reference>
            <!--    这里clickoutside逻辑有bug，暂时把outside设置为这个按钮        -->
            <div class="icon-selector" @click="showIconList = !showIconList" v-click-outside="onClickOutside">
              <circle-icon :color="colorList[currentColorIndex]" class="icon" :svg-name="`ic_type_white${currentIconIndex}`" />
            </div>
          </template>
          <div class="type-grid">
            <div v-for="index in typeIconSize" :key="index" class="icon-wrapper" :class="{'unselected': currentIconIndex !== index - 1}"
                 @click="onClickIconItem(index - 1)">
              <circle-icon class="icon" color="#e6e6e6" :svg-name="`ic_type_black${index - 1}`" />
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <!--    todo:智能列表功能暂时不做-->
    <div class="h-divider"></div>
    <div class="button-layout">
      <button class="button-yes"
              :class="{'able': typeName.length > 0}"
              :type="typeName.length > 0? 'submit' : 'button'">
        好
      </button>
      <button class="button-no" type="button" @click="onClickCancel">取消</button>
    </div>
  </form>
</template>
<script setup>
import CircleIcon from "@/components/common/CircleIcon.vue";
import { DEFAULT_COLOR_INDEX, DEFAULT_ICON_INDEX, DEFAULT_TITLE, TYPE_COLOR_LIST, TYPE_ICON_SIZE } from "@/components/menu/menuConstants";
import { ref, watch } from "vue";

const props = defineProps({
  colorIndex: {
    type: Number,
    default: DEFAULT_COLOR_INDEX
  },
  iconIndex: {
    type: Number,
    default: DEFAULT_ICON_INDEX
  },
  name: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: DEFAULT_TITLE
  },
  typeId: {
    type: Number,
  }
})

const currentColorIndex = ref(props.colorIndex)
const currentIconIndex = ref(props.iconIndex)
const typeName = ref(props.name)
const showIconList = ref(false)
const colorList = ref(TYPE_COLOR_LIST)
const typeIconSize = ref(TYPE_ICON_SIZE)

const emit = defineEmits(['close'])


watch(() => props.typeId, () => {
  currentColorIndex.value = props.colorIndex
  currentIconIndex.value = props.iconIndex
  typeName.value = props.name
})

const onClickOutside = () => {
  showIconList.value = false
}
const onClickCancel = () => {
  showIconList.value = false
  emit('close')
}

const onSubmit = () => {
  showIconList.value = false
  let newItem = {
    name: typeName.value,
    colorIndex: currentColorIndex.value,
    color: colorList.value[currentColorIndex.value],
    svgIndex: currentIconIndex.value,
    id: props.typeId
  }
  emit('close', newItem)
}

const onClickColorItem = (index) => {
  currentColorIndex.value = index
}
const onClickIconItem = (index) => {
  currentIconIndex.value = index
  showIconList.value = false
}
// // todo 点击气泡外部、关闭iconList
// const onClickForm = () => {
//   showIconList.value = false
// }

const nameInput = ref(null)
const autoFocus = () => {
  // 这里用nextTick并不能使inout聚焦
  setTimeout(() => {
    nameInput.value.focus()
  })
}
defineExpose({ autoFocus })
</script>
<style scoped lang="scss">

.type-grid {
  display: grid;
  grid-template-columns: repeat(6, 44px);

  .icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #808080;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    margin: 4px;

    .icon {
      width: 100%;
      height: 100%;
    }

    &.icon-wrapper.unselected {
      border-color: transparent;
    }
  }
}


</style>