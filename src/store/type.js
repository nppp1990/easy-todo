import { defineStore } from "pinia";
import { ref } from "vue";
import { createType } from "@/service";


// { colorIndex: 1, svgIndex: 0, name: 'name1', count: 2, id: 1 }
export const useTypeStore = defineStore('type', () => {
  const incrementId = ref(0)
  const uniqueDocId = ref(1)
  const addType = async (typeInfo) => {
    const type = await createType(typeInfo)
    type.id = incrementId.value++
    return type
  }
  const setTypeId = (id) => {
    incrementId.value = id
  }

  const incrementDocId = () => {
    return ++uniqueDocId.value
  }

  return {
    incrementId, addType, setTypeId,
    uniqueDocId, incrementDocId,
  }
}, { persist: true })