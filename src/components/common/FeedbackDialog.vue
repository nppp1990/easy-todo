<template>
  <el-dialog
    class="feedback"
    v-model="showDialog"
    :show-close="false"
    align-center
    width="260px">
    <div class="feedback-dialog">
      <img src="src/assets/images/haha.jpeg" alt="">
      <h3>{{ title }}</h3>
      <span class="message">{{ message }}。</span>
      <div style="margin-top: 16px">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="onClickSure()">删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { defineAttrFromProps } from "@/utils/vueUtils";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sureText: {
    type: String,
    default: '删除',
  },
  cancelText: {
    type: String,
    default: '取消',
  }
})

const emits = defineEmits([
  'update:show',
  'onSure'
])

const showDialog = defineAttrFromProps(props, emits, 'show')
function onClickSure() {
  showDialog.value = false
  emits('onSure')
}
</script>
<style scoped lang="scss">
.feedback-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;

  color: var(--todo-black1);

  img {
    margin-top: 16px;
    width: 50px;
    height: 50px;
    border-radius: 8px;
  }

  h3 {
    margin-top: 24px;
    font-size: 14px;
    color: black;
    font-weight: bold;
  }

  span.message {
    margin: 6px 16px 0;
    text-align: center;
    font-size: 10px;
  }

  .el-button {
    width: 109px;
    height: 28px;
    line-height: 28px;
    border-radius: 6px;
    font-size: 13px;
  }
}
</style>