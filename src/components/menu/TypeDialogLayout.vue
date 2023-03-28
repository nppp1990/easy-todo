<template>
  <form class="dialog-layout" @submit.prevent="onSubmit">
    <h4>新建列表</h4>
    <div class="name-layout">
      <span>名称：</span>
      <input type="text" v-model="typeName">
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
            <div class="icon-selector" @click="showIconList = !showIconList">
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
<script>
import CircleIcon from "@/components/common/CircleIcon.vue";

const DEFAULT_ICON_INDEX = 0
const DEFAULT_COLOR_INDEX = 5
export const TYPE_COLOR_LIST = [
  '#fc3d39',
  '#fd9426',
  '#fecb2f',
  '#29c55e',
  '#56abef',
  '#157efb',
  '#595ad3',
  '#e8456c',
  '#bf7ad9',
  '#9c8565',
  '#5b6770',
  '#dba6a0',
]
const TYPE_ICON_SIZE = 78

export default {
  name: "TypeDialogLayout",
  components: {
    CircleIcon,
  },
  props: {
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
    }
  },
  data() {
    return {
      currentColorIndex: this.colorIndex,
      currentIconIndex: this.iconIndex,
      typeName: this.name,
      showIconList: false,
      colorList: TYPE_COLOR_LIST,
      typeIconSize: TYPE_ICON_SIZE
    }
  },
  methods: {
    reset() {
      this.typeName = ''
      this.currentIconIndex = DEFAULT_ICON_INDEX
      this.currentColorIndex = DEFAULT_COLOR_INDEX
    },

    onClickCancel() {
      this.showIconList = false
      this.$emit('close')
    },
    onSubmit() {
      this.showIconList = false
      this.$emit('close', {
        name: this.typeName,
        colorIndex: this.currentColorIndex,
        color: this.colorList[this.currentColorIndex],
        svgIndex: this.currentIconIndex,
      })
    },
    onClickColorItem(index) {
      this.currentColorIndex = index
    },
    onClickIconItem(index) {
      this.currentIconIndex = index
      this.showIconList = false
    },
    // todo 点击气泡外部、关闭iconList
    onClickForm() {
      this.showIconList = false
    }
  }
}
</script>
<style scoped>
</style>