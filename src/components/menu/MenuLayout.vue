<template>
  <div>
    <input type="text" name="" id="" placeholder="搜索">
    <div class="todo-card-layout">
      <card-item class="todo-item item-left" :card-type="1" :is-selected="currentCard=== 1"
                 @click="onClickCard(1)" />
      <card-item class="todo-item" :card-type="2" :is-selected="currentCard=== 2"
                 @click="onClickCard(2)" />
    </div>
    <card-item class="all-card" :card-type="3" :is-selected="currentCard=== 3"
               @click="onClickCard(3)" />
  </div>
</template>
<script>
import CardItem from "@/components/menu/CardItem.vue";

export default {
  name: "MenuLayout",
  components: {
    CardItem
  },
  data() {
    return {
      currentCard: 1,
    }
  },
  methods: {
    onClickCard(type) {
      this.currentCard = type
    }
  }
}
</script>
<style scoped lang="scss">
input {
  width: 100%;
  height: 30px;
  display: block;
}

.todo-card-layout {
  margin-top: 8px;
  display: flex;

  .todo-item {
    flex: 1;
  }

  .item-left {
    margin-right: 8px;
  }
}

.all-card {
  margin-top: 8px;
  width: 100%;
}
</style>