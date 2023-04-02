<template>
  <div>
    <circle-icon class="circle" :svg-name="svgName" :color="color" />
    <input v-if="edit" v-model="nameFromInput" ref="input"
           @focusout="$emit('modifyName', nameFromInput)"
           @keydown.enter="$emit('modifyName', nameFromInput)"
           @click.stop />
    <span v-else class="name">{{ name }}</span>
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
    },
    edit: {
      type: Boolean,
      default: true,
    }
  },
  // emits: ['update:edit'],
  data() {
    return {
      nameFromInput: this.name
    }
  },
  watch: {
    edit(newEdit) {
      if (newEdit) {
        this.nameFromInput = this.name
        this.$nextTick(() => {
          this.$refs.input.focus()
          this.$refs.input.selectionStart = 0
          this.$refs.input.selectionEnd = this.nameFromInput.length
        })
      }
    }
  },
}
</script>
<style scoped lang="scss">
</style>