import { computed } from "vue";

export const defineAttrFromProps = (props, emit, key) => {
  return computed({
    get() {
      return props[key]
    },
    set(value) {
      emit(`update:${ key }`, value)
    }
  })
}