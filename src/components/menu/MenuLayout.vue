<template>
  <div class="menu-layout">
    <div class="input-wrapper">
      <input type="text" placeholder="搜索" v-model="searchText" @keydown.enter="onSearchEnter">
      <img src="src/assets/svg/ic_search.svg" alt="" class="input-search">
      <div class="input-close-wrapper" v-show="searchText.length > 0" @click="searchText=''">
        <img src="src/assets/svg/ic_search_close.svg" alt="" class="input-close">
      </div>
    </div>
    <div class="todo-card-layout" @contextmenu.prevent="onMouseRightClick($event)">
      <card-item class="todo-item item-left" :card-type="1" :is-selected="isCardSelected(1)"
                 :count="currentTypeStore.countInfo.todayCount"
                 @click="onClickCard(1)" />
      <card-item class="todo-item" :card-type="2" :is-selected="isCardSelected(2)"
                 :count="currentTypeStore.countInfo.planCount"
                 @click="onClickCard(2)" />
    </div>
    <card-item class="all-card" :card-type="3" :is-selected="isCardSelected(3)"
               :count="currentTypeStore.countInfo.allCount"
               @click="onClickCard(3)"
               @contextmenu.prevent="onMouseRightClick($event)" />
    <type-list-layout ref="typeList" style="margin-top: 16px; margin-bottom: 30px;" @right-click-item="onTypeListContextSelected" />
    <div class="bottom-add bottom-divider">
      <div class="add"></div>
      <span @click="addType">添加列表</span>
    </div>
    <el-dialog v-model="showTypeDialog"
               :close-on-click-modal="false"
               width="480px"
               :show-close="false"
               align-center>
      <type-dialog-layout @close="onDialogClosed" ref="dialogContent" />
    </el-dialog>
  </div>
</template>
<script setup>
import CardItem from "@/components/menu/CardItem.vue";
import TypeListLayout from "@/components/menu/TypeListLayout.vue";
import TypeDialogLayout from "@/components/menu/TypeDialogLayout.vue";
import { nextTick, ref, watch } from "vue";
import { useTypeStore } from "@/store/type";
import { TODO_TYPE_ALL, TODO_TYPE_TODAY, TODO_TYPE_PLAN, TYPE_ALL_ID, TYPE_TODAY_ID, TYPE_PLAN_ID, TYPE_SEARCH_ID, TodoType } from "@/utils/typeUtils";
import { useCurrentTypeStore } from "@/store/currentType";

const searchText = ref('')
const showTypeDialog = ref(false)

const dialogContent = ref(null)
const typeList = ref(null)
const currentTypeStore = useCurrentTypeStore()


watch(showTypeDialog, (newShow) => {
  if (newShow) {
    nextTick(() => {
      dialogContent.value.autoFocus()
    })
  }
})

function isCardSelected(type) {
  const typeId = currentTypeStore.item.id
  if (type === 1) {
    return typeId === TYPE_TODAY_ID
  } else if (type === 2) {
    return typeId === TYPE_PLAN_ID
  } else if (type === 3) {
    return typeId === TYPE_ALL_ID
  }
  return false
}

const onClickCard = (type) => {
  if (type === 1) {
    currentTypeStore.updateCurrentType(TODO_TYPE_TODAY)
  } else if (type === 2) {
    currentTypeStore.updateCurrentType(TODO_TYPE_PLAN)
  } else {
    currentTypeStore.updateCurrentType(TODO_TYPE_ALL)
  }
}
const typeStore = useTypeStore()

const onDialogClosed = (res) => {
  showTypeDialog.value = false
  if (res) {
    if (res.id === -1) {
      typeStore.addType(res).then(typeInfo => {
        console.log('---add type', typeInfo)
        typeList.value.addType(typeInfo)
      }).catch(err => console.log(err))
    } else {
      typeList.value.modifyItem(res)
    }
  }
}

let timer = null
let lastType = null
watch(searchText, () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (searchText.value) {
      if (currentTypeStore.item.id !== TYPE_SEARCH_ID) {
        // 记录上次的type
        lastType = currentTypeStore.item
      }
      currentTypeStore.updateCurrentType(new TodoType(TYPE_SEARCH_ID, searchText.value, 0))
    } else {
      currentTypeStore.updateCurrentType(lastType)
    }
    timer = null
  }, 500)
})

function onSearchEnter() {
  if (!timer && currentTypeStore.item.id !== TYPE_SEARCH_ID && searchText.value) {
    lastType = currentTypeStore.item
    currentTypeStore.updateCurrentType(new TodoType(TYPE_SEARCH_ID, searchText.value, 0))
  }
}

const onMouseRightClick = (ev) => {
  console.log('-----right mouse', ev)
}

const onTypeListContextSelected = (res) => {
  let { typeItem, type } = res
  if (type === 'showType') {
    if (typeItem) {
      showTypeDialog.value = true
      let { colorIndex, svgIndex, name, id } = typeItem
      nextTick(() => {
        dialogContent.value.showDialog({
          title: `"${ name }"简介`,
          name,
          colorIndex,
          iconIndex: svgIndex,
          typeId: id,
        })
      })
    }
  }
}

const addType = () => {
  showTypeDialog.value = true
  nextTick(() => {
    dialogContent.value.showDialog({})
  })
}

defineExpose({ createType: addType })
</script>
<style scoped lang="scss">
@import "@/assets/style/type-dialog.scss";

.menu-layout {
  display: flex;
  flex-direction: column;

  .input-wrapper {
    position: relative;

    input {
      //transition: outline-width 4s, text-shadow 2s;
      width: 100%;
      height: 30px;
      border: 1px solid #d2d2d2;
      outline: 0 solid #7aa7e5;
      outline-offset: 0;
      border-radius: 6px;
      padding: 0 28px;
      background-color: #d7d7d7;
      color: var(--todo-black1);

      &:focus {
        outline-width: 3px;
        animation: border-ani 0.2s;
      }

      &:hover {
        border-color: #7aa7e5;
      }

      &::placeholder {
        color: var(--todo-placeholder-color);
      }

      @keyframes border-ani {
        0% {
          outline-width: 0;
        }

        70% {
          outline-width: 8px;
          outline-color: rgba(133, 167, 204, 0.99)
        }

        100% {
          outline-width: 3px;
          outline-color: #7aa7e5
        }
      }
    }


    .input-search {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 8px;
      left: 8px;
    }

    .input-close-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 28px;
      display: flex;
      align-items: center;
      justify-content: center;

      .input-close {
        width: 14px;
        height: 14px;
      }
    }
  }
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
  // 保证比menuList的大
  z-index: 101;

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