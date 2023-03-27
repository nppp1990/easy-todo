<template>
  <div class="menu-layout">
    <input type="text" name="" id="" placeholder="搜索">
    <div class="todo-card-layout">
      <card-item class="todo-item item-left" :card-type="1" :is-selected="currentCard=== 1"
                 @click="onClickCard(1)" />
      <card-item class="todo-item" :card-type="2" :is-selected="currentCard=== 2"
                 @click="onClickCard(2)" />
    </div>
    <card-item class="all-card" :card-type="3" :is-selected="currentCard=== 3"
               @click="onClickCard(3)" />
    <type-list-layout />
    <div class="bottom-add bottom-divider">
      <div class="add"></div>
      <span>添加列表</span>
    </div>
  </div>
</template>
<script>
import CardItem from "@/components/menu/CardItem.vue";
import TypeListLayout from "@/components/menu/TypeListLayout.vue";

export default {
  name: "MenuLayout",
  components: {
    CardItem,
    TypeListLayout,
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
.menu-layout {
  display: flex;
  flex-direction: column;
}

input {
  width: 100%;
  height: 30px;
  display: block;
}

.todo-card-layout {
  margin-top: 18px;
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

.bottom-add {
  display: flex;
  height: 30px;
  width: 100%;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;

  span {
    margin-left: 8px;
    font-size: 14px;
    color: var(--todo-black1);
  }

  .add {
    margin-left: 8px;
    border: 1px solid;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    color: var(--todo-black1);
  }

  .add::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 8px;
    height: 1px;
    margin-left: -4px;
    margin-top: -0.5px;
    background-color: var(--todo-black1);
  }

  .add::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1px;
    height: 8px;
    margin-left: -0.5px;
    margin-top: -4px;
    background-color: var(--todo-black1);
  }
}

.bottom-divider::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: var(--divider-gray1);
  top: 0;
}
</style>