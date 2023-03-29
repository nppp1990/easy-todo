import { createStore } from "vuex";
import type from "@/store/modules/type";

const store = createStore({
  modules: {
    type,
  }
})

export default store