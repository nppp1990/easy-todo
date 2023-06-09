<template>
  <div class="card-layout" :class="classObj">
    <div class="circle-icon">
      <img :src="imgSrc" alt="">
      <span v-if="cardType===1" class="day">{{ currentDay }}</span>
    </div>
    <span class="text">{{ showText }}</span>
    <span class="count">{{ count }}</span>
  </div>
</template>
<script setup>
import dayjs from "dayjs";
import { TYPE_ALL, TYPE_TODAY, TYPE_TODO } from "@/components/menu/menuConstants";
import { computed, ref } from "vue";

const props = defineProps({
  cardType: {
    type: Number,
    default: TYPE_TODAY
  },
  count: {
    type: Number,
    default: 0
  },
  isSelected: {
    type: Boolean,
    default: false,
  }
})

const currentDay = ref(dayjs().format('D'))
const imgSrc = computed(() => {
  let iconName
  switch (props.cardType) {
    case TYPE_TODO:
      iconName = 'ic_plan'
      break
    case TYPE_ALL:
      iconName = 'ic_all'
      break
    case TYPE_TODAY:
    default:
      iconName = 'ic_today'
      break
  }
  return `src/assets/svg/${ iconName + (props.isSelected ? '_selected' : '') }.svg`
})

const showText = computed(() => {
  switch (props.cardType) {
    case TYPE_TODO:
      return '计划'
    case TYPE_ALL:
      return '全部'
    case TYPE_TODAY:
    default:
      return '今天'
  }
})

const classObj = computed(() => {
  return {
    selected: props.isSelected,
    unselected: !props.isSelected,
    today: props.cardType === TYPE_TODAY,
    plan: props.cardType === TYPE_TODO,
    all: props.cardType === TYPE_ALL,
  }
})
</script>
<style scoped lang="scss">
.card-layout {
  padding: 8px;
  border-radius: 12px;
  background-color: #cbcbcb;
  position: relative;
  color: #4c4c4c;

  .circle-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    position: relative;

    img {
      width: 16px;
      height: 16px;
    }

    .day {
      position: absolute;
      font-size: 12px;
      font-weight: bold;
      transform: scale(0.5);
      text-align: center;
      padding-top: 7px;
      color: white;
    }
  }

  .circle-icon.today {
    background-color: var(--todo-blue);
  }

  .text {
    font-size: 14px;
    margin-top: 2px;
    color: inherit;
    font-weight: normal;
  }

  .count {
    font-size: 16px;
    color: inherit;
    font-weight: bold;
    position: absolute;
    right: 12px;
    top: 8px;
  }
}


.card-layout.selected {
  color: white;

  .circle-icon {
    background-color: white;
  }

  .day {
    color: var(--todo-blue);
  }
}

.card-layout.today.unselected .circle-icon {
  background-color: var(--todo-blue);
}

.card-layout.plan.unselected .circle-icon {
  background-color: var(--todo-red);
}

.card-layout.all.unselected .circle-icon {
  background-color: var(--todo-gray1);
}

.card-layout.selected.today {
  background-color: var(--todo-blue);
}

.card-layout.selected.plan {
  background-color: var(--todo-red);
}

.card-layout.selected.all {
  background-color: var(--todo-gray1);
}

.card-layout:hover {
  background-color: #b7b7b7;
}
</style>