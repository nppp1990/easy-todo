import { createType } from "@/service";

export const MUTATION_INCREMENT = 'mutation_increment'
export const MUTATION_SET_INCREMENT_ID = 'mutation_set_increment_id'
export const ACTION_CREATE_TYPE = 'action_create_type'

const type = {
  state() {
    return {
      incrementId: 0,
    }
  },
  mutations: {
    [MUTATION_INCREMENT](state) {
      state.incrementId++

    },
    [MUTATION_SET_INCREMENT_ID](state, id) {
      state.incrementId = id
    },

  },
  actions: {
    [ACTION_CREATE_TYPE]({ state, commit }, typeInfo) {
      return new Promise((resolve, reject) => {
        createType(typeInfo).then(res => {
          commit(MUTATION_INCREMENT)
          res.id = state.incrementId
          resolve(res)
        }).catch(err => reject(err))
      })
    }
  },
  getters: {
    incrementId: state => state.incrementId,
  },
}

export default type