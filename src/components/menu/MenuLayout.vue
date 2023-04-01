<template>
  <div class="menu-layout">
    <!--  todo: 怎么做一个聚焦后、border变大的特效、并且保证内容位置不变  -->
    <div class="input-wrapper">
      <input type="text" placeholder="搜索" v-model="searchText">
      <img src="src/assets/svg/ic_search.svg" alt="" class="input-search">
      <div class="input-close-wrapper" v-show="searchText.length > 0" @click="clearSearch">
        <img src="src/assets/svg/ic_search_close.svg" alt="" class="input-close">
      </div>
    </div>
    <div class="todo-card-layout" @contextmenu.prevent="onMouseRightClick($event)">
      <card-item class="todo-item item-left" :card-type="1" :is-selected="currentCard=== 1"
                 @click="onClickCard(1)" />
      <card-item class="todo-item" :card-type="2" :is-selected="currentCard=== 2"
                 @click="onClickCard(2)" />
    </div>
    <card-item class="all-card" :card-type="3" :is-selected="currentCard=== 3"
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
               @closed="onDialogAnimationEnd"
               :show-close="false"
               align-center>
      <type-dialog-layout @close="onDialogClosed" ref="dialogContent" v-bind="typeDialogInfo" />
    </el-dialog>
  </div>
</template>
<script>
import CardItem from "@/components/menu/CardItem.vue";
import TypeListLayout from "@/components/menu/TypeListLayout.vue";
import TypeDialogLayout from "@/components/menu/TypeDialogLayout.vue";
import { ACTION_CREATE_TYPE } from "@/store/modules/type";
import { DEFAULT_COLOR_INDEX, DEFAULT_ICON_INDEX, DEFAULT_TITLE } from "@/components/menu/TypeDialogLayout.vue";

export default {
  name: "MenuLayout",
  components: {
    CardItem,
    TypeListLayout,
    TypeDialogLayout,
  },
  data() {
    return {
      currentCard: 1,
      searchText: '',
      showTypeDialog: false,
      typeDialogInfo: {
        name: '',
        colorIndex: DEFAULT_COLOR_INDEX,
        iconIndex: DEFAULT_ICON_INDEX,
        title: DEFAULT_TITLE,
        typeId: -1,
      }
    }
  },
  watch: {
    showTypeDialog(newShow) {
      if (newShow) {
        this.$nextTick(() => {
          this.$refs.dialogContent.autoFocus()
        })
      }
    }
  },
  methods: {
    onClickCard(type) {
      this.currentCard = type
    },
    clearSearch() {
      this.searchText = ''
    },
    onDialogClosed(res) {
      this.showTypeDialog = false
      if (res) {
        console.log('----submit', res)
        if (res.id === -1) {
          this.$store.dispatch(ACTION_CREATE_TYPE, res).then(typeInfo => {
            console.log('---add type', typeInfo)
            this.$refs.typeList.addType(typeInfo)
          }).catch(err => {
            console.log(err)
          })
          console.log('-----id:' + this.$store.getters.incrementId)
        } else {
          this.$refs.typeList.modifyItem(res)
        }
      } else {
        console.log('----close dialog')
      }
    },
    onDialogAnimationEnd() {
    },
    onMouseRightClick(ev) {
      console.log('-----right mouse', ev)
    },
    onTypeListContextSelected(res) {
      let { typeItem, type, index, subIndex } = res
      if (type === 'showType') {
        if (typeItem) {
          this.showTypeDialog = true
          let { colorIndex, svgIndex, name, id } = typeItem
          this.typeDialogInfo.title = `"${ name }"简介`
          this.typeDialogInfo.name = name
          this.typeDialogInfo.colorIndex = colorIndex
          this.typeDialogInfo.iconIndex = svgIndex
          this.typeDialogInfo.typeId = id
        }
      }
    },
    addType() {
      this.showTypeDialog = true
      this.typeDialogInfo = {
        name: '',
        colorIndex: DEFAULT_COLOR_INDEX,
        iconIndex: DEFAULT_ICON_INDEX,
        title: DEFAULT_TITLE,
        typeId: -1,
      }
    }
  }
}
</script>
<style scoped lang="scss">
.menu-layout {
  display: flex;
  flex-direction: column;

  .input-wrapper {
    position: relative;

    input {
      width: 100%;
      height: 30px;
      border: 1px solid #d2d2d2;
      border-radius: 6px;
      padding: 0 28px;
      outline: none;
      display: block;
      background-color: #d7d7d7;
      background-size: 12px 12px;
      color: var(--todo-black1);
    }

    input:focus, :hover {
      border-color: #74a2e2;
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
        width: 12px;
        height: 12px;
      }
    }
  }

  input::placeholder {
    color: var(--todo-placeholder-color);
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