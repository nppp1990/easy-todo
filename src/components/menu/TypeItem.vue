<template>
  <div>
    <circle-icon class="circle" :svg-name="svgName" :color="color" />
    <span class="name">{{ name }}</span>
    <span class="count">{{ count }}</span>
  </div>
</template>
<script>
import CircleIcon from "@/components/common/CircleIcon.vue";

export default {
  name: "TypeItem",
  components: {
    CircleIcon,
  },
  props: {
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      required: true
    },
    svgName: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped lang="scss">
</style>