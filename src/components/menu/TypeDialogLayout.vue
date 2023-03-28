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
          <div v-for="i in 12" class="circle-color" :key="i" :style="`background-color: ${colorList[i - 1]}`"
               @click="onClickColorItem(i)">
            <div v-show="i === currentColorIndex" class="select-dot"></div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="icon-layout">
        <span>图标：</span>
        <div class="icon-selector">
          <circle-icon :color="colorList[currentColorIndex - 1]" class="icon" />
        </div>
        <div></div>
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
      <button class="button-no" type="button" @click="$emit('close')">取消</button>
    </div>
  </form>
</template>
<script>
import CircleIcon from "@/components/common/CircleIcon.vue";

export default {
  name: "TypeDialogLayout",
  components: {
    CircleIcon,
  },
  data() {
    return {
      currentColorIndex: 1,
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
      typeName: ''
    }
  },
  methods: {
    onSubmit() {
      this.$emit('close', {
        name: this.typeName,
        colorIndex: this.currentColorIndex,
        color: this.colorList[this.currentColorIndex - 1]
      })
    },
    onClickColorItem(index) {
      this.currentColorIndex = index
    },
  }
}
</script>
<style scoped>
</style>