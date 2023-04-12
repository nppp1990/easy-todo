import { computed } from "vue";

export const defineAttrFromProps = (props, emit, key, otherEvent = null) => {
  return computed({
    get() {
      return props[key]
    },
    set(value) {
      let oldValue = props[key]
      if (value !== oldValue) {
        emit(`update:${ key }`, value)
        if (otherEvent) {
          emit(otherEvent, { key, value, oldValue})
        }
      }
    }
  })
}

export function useModel(props, emit, propName) {
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