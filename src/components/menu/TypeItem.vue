<template>
  <div class="selected" draggable="true">
    <div class="circle">
      <img src="src/assets/svg/ic_menu.svg" alt="">
    </div>
    <span class="name">{{ name }}</span>
    <span class="count">{{ count }}</span>
  </div>
</template>
<script>
export default {
  name: "TypeItem",
  props: {
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style scoped lang="scss">
div {
  display: flex;
  align-items: center;

  & > .circle {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background-color: var(--todo-type-color1);
    text-align: center;
    margin-right: 12px;

    img {
      width: 16px;
      height: 16px;
      margin: 0 auto;
    }
  }

  .name {
    font-size: 14px;
    color: var(--todo-black1);
    flex: 1;
  }

  .count {
    font-size: 12px;
    color: var(--todo-text-gray2);
  }


}

div.selected {
  border-radius: 6px;
  //background-color: #489cfc;
  padding-left: 12px;
  padding-right: 12px;
}
</style>