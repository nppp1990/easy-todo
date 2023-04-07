<template>
  <div class="title-layout">
    <div class="add">
      <div class="line line-x"></div>
      <div class="line line-y"></div>
    </div>
    <h1 class="title" :style="`color: ${colorList[colorIndex]}`">{{ title }}</h1>
    <h1 class="count" :style="`color: ${colorList[colorIndex]}`">{{ count }}</h1>
  </div>
</template>
<script>
import { TYPE_COLOR_LIST } from "@/components/menu/TypeDialogLayout.vue";

export default {
  name: "TitleLayout",
  props: {
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
  },
  data() {
    return {
      colorList: TYPE_COLOR_LIST,
    }
  }
}
</script>
<style scoped lang="scss">
.title-layout {
  height: 120px;
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
    font-size: 32px;
    color: #157efb;
    position: absolute;
    top: 54px;

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