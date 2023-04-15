<template>
  <div class="title-layout">
    <div class="add" @click="$emit('clickAdd')">
      <div class="line line-x" />
      <div class="line line-y" />
    </div>
    <h1 class="title" :style="`color: ${colorList[colorIndex]}`">{{ title }}</h1>
    <h1 class="count" :style="`color: ${colorList[colorIndex]}`">{{ count }}</h1>
  </div>
</template>
<script setup>
import { TYPE_COLOR_LIST } from "@/components/menu/menuConstants";

defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  colorIndex: {
    type: Number,
    required: true
  },
})
defineEmits(['clickAdd'])
const colorList = TYPE_COLOR_LIST
</script>
<style scoped lang="scss">
.title-layout {
  height: 90px;
  position: relative;

  .add {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 16px;
    right: 14px;
    border-radius: 6px;

    &:hover {
      background-color: #f2f2f2;

      .line {
        background-color: #6d6d6d;
      }
    }

    .line {
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: #a7a7a7;

      &.line-x {
        width: 12px;
        height: 1px;
        margin-left: -6px;
        margin-top: -0.5px;
      }

      &.line-y {
        width: 1px;
        height: 12px;
        margin-left: -0.5px;
        margin-top: -6px;
      }
    }
  }

  h1 {
    font-size: 36px;
    color: var(--todo-blue);
    position: absolute;
    top: 34px;

    &.title {
      font-weight: bold;
      left: 16px;
    }

    &.count {
      right: 18px;
    }
  }
}
</style>