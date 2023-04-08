import { defineStore } from "pinia";
import { ref } from "vue";
import { createType } from "@/service";

export const useTypeStore = defineStore('type', () => {
  const incrementId = ref(0)
  const addType = async (typeInfo) => {
    const type = await createType(typeInfo)
    type.id = incrementId.value++
    return type
  }
  const setTypeId = (id) => {
    incrementId.value = id
  }

  return {
    incrementId, addType, setTypeId
  }
})