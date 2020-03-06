// 在store/modules/geo.js中定义改变位置的actions和mutations ->setPosition

const state = () => ({ position: {} });

const mutations = {
  setPosition(state, val) {
    state.position = val;
  }
};

const actions = {
  setPosition: ({ commit }, position) => {
    commit("setPosition", position);
  }
};

export default { namespaced: true, state, mutations, actions };
