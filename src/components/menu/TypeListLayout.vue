<template>
  <div class="type-layout">
    <h3>我的列表</h3>
    <TransitionGroup name="list">
      <type-item v-for="item in list" :name="item.name" :count="item.count" :key="item.id"
                 class="menu-item-layout" />
    </TransitionGroup>
  </div>
</template>
<script>
import TypeItem from "@/components/menu/TypeItem.vue";

export default {
  name: "TypeListLayout",
  components: {
    TypeItem,
  },
  data() {
    return {
      list: [
        { color: 1, name: 'name1', count: 2, id: 1 },
        { color: 2, name: 'name2', count: 0, id: 2 },
        { color: 4, name: 'name3', count: 1, id: 3 },
        { color: 1, name: 'name4', count: 4, id: 4 },
      ]
    }
  },
}
</script>
<style scoped lang="scss">
.type-layout {
  padding: 16px 0;
  display: flex;
  flex-direction: column;

  h3 {
    padding-left: 12px;
    font-size: 12px;
    color: var(--todo-text-gray2);
  }

  .menu-item-layout {
    height: 36px;
    width: 100%;
  }
}
</style>