import { createStore } from "vuex";
import type from "@/store/modules/type";
import currentType from "@/store/modules/currentType";

const store = createStore({
  modules: {
    type,
    currentType,
  }
})

export default store