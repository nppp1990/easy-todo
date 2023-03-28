<template>
  <div>
    <div class="circle">
      <img src="../../assets/svg/ic_type_white0.svg" alt="">
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
</style>