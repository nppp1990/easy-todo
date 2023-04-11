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

export function useModel(props, propName, emit) {
  return computed({
    get() {
      return new Proxy(props[propName], {
        set(obj, name, val) {
          console.log('---', name, val)
          emit('update:' + propName, {
            ...obj,
            [name]: val,
          })
          return true
        }
      })
    },
    set(val) {
      emit(`update:${ propName }`, val)
    }
  })
}