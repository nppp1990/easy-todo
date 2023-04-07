export const MUTATION_UPDATE_CURRENT_TYPE = 'mutation_update_current_type'

const currentType = {
  state() {
    return {
      item: {
        colorIndex: 1,
        svgIndex: 0,
        name: 'name1',
        count: 2,
        id: 1
      },
    }
  },
  mutations: {
    [MUTATION_UPDATE_CURRENT_TYPE](state, item) {
      state.item = item
    }
  },
  actions: {},
  getters: {
    item: state => state.item
  }
}

export default currentType