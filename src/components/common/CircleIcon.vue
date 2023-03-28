<template>
  <div :style="`background-color: ${color};`">
    <img :src="`src/assets/svg/${svgName}.svg`" alt="">
  </div>
</template>
<script>
export default {
  name: "CircleIcon",
  props: {
    color: {
      type: String,
      default: '#157efb'
    },
    svgName: {
      type: String,
      default: 'ic_type_white0'
    }
  }
}
</script>
<style scoped lang="scss">
div {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  //background-color: var(--todo-type-color1);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 66.6%;
    height: 66.6%;
  }
}
</style>