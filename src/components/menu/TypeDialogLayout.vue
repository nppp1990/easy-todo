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
          <div v-for="i in typeIconSize" class="circle-color" :key="i" :style="`background-color: ${colorList[i - 1]}`"
               @click="onClickColorItem(i)">
            <div v-show="i === currentColorIndex" class="select-dot"></div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="icon-layout">
        <span>图标：</span>
        <el-popover placement="right" :width="274" trigger="click" :visible="showIconList">
          <template #reference>
            <div class="icon-selector" @click="showIconList = !showIconList">
              <circle-icon :color="colorList[currentColorIndex - 1]" class="icon" :svg-name="`ic_type_white${currentIconIndex - 1}`" />
            </div>
          </template>
          <div class="type-grid">
            <div v-for="index in 70" :key="index" class="icon-wrapper" :class="{'unselected': currentIconIndex !== index}"
                 @click="onClickIconItem(index)">
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

const DEFAULT_ICON_INDEX = 1
const DEFAULT_COLOR_INDEX = 6

export default {
  name: "TypeDialogLayout",
  components: {
    CircleIcon,
  },
  data() {
    return {
      currentColorIndex: DEFAULT_COLOR_INDEX,
      currentIconIndex: DEFAULT_ICON_INDEX,
      showIconList: false,
      colorList: [
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
      ],
      typeName: '',
      typeIconSize: 78
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
        color: this.colorList[this.currentColorIndex - 1],
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