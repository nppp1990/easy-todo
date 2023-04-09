<template>
  <div class="edit-root">
    <span>没有提醒事项</span>
    <edit-item />
    <edit-item />
  </div>
</template>
<script>
import EditItem from "@/components/edit/EditItem.vue";

export default {
  name: "EditLayout",
  components: { EditItem }
}
</script>
<style scoped lang="scss">
.edit-root {
  & > span {
    color: var(--todo-gray3);
    font-size: 26px;
    position: absolute;
    left: 50%;
    top: 50%;
    display: inline-block;
    transform: translate(-50%, -50%);
  }
}
</style>