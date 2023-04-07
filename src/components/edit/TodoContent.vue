<template>
  <div class="content-layout">
    <title-layout v-bind="currentType" />
    12345
  </div>
</template>
<script>
import { mapState } from "vuex";
import { TYPE_COLOR_LIST } from "@/components/menu/TypeDialogLayout.vue";
import TitleLayout from "@/components/edit/TitleLayout.vue";

export default {
  name: "TodoContent",
  data() {
    return {
      colorList: TYPE_COLOR_LIST,
    }
  },
  components: {
    TitleLayout,
  },
  computed: {
    ...mapState({
      currentType: state => {
        let { name: title, count, colorIndex } = state.currentType.item
        return {
          title, count, colorIndex
        }
      }
    })
  },
}
</script>
<style scoped lang="scss">
.content-layout {
  display: flex;
  flex-direction: column;
}
</style>