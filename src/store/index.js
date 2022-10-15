import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userList: [],
    userDetails: {},
  },
  getters: {
    userList: (state) => {
      return state.userList;
    },
    userDetails: (state) => state.userDetails,
  },
  mutations: {
    setuserList: (state, userList) => (state.userList = userList),
    addNewUser: (state, newUser) =>
      (state.userList = [newUser, ...state.userList]),

    deleteNewUser: (state, userList) =>
      (state.userList = [userList, ...state.userList]),

    displayUserDetails(state, userDetails) {
      state.userDetails = userDetails;
    },
  },
  actions: {
    async fetchuserList({ commit }) {
      const response = await axios.get("http://122.170.1.83:8899/api/v1/user");
      commit("setuserList", response.data.result);
    },

    async addUser({ commit }, addUser) {
      var data = new FormData();

      data.append("name", addUser.name);
      data.append("mobileNo", addUser.mobileNo);
      data.append("email", addUser.email);
      data.append("latitude", addUser.latitude);
      data.append("longitude", addUser.longitude);
      data.append("image", addUser.image);
      data.append("address", addUser.address);
      const response = await axios.post(
        `http://122.170.1.83:8899/api/v1/user`,
        data
      );
      commit("addNewUser", response.data.result);
    },

    async updateUser({ commit }, updateUser) {
      console.log(commit);
      var data = new FormData();
      data.append("name", updateUser.name);
      data.append("mobileNo", updateUser.mobileNo);
      data.append("email", updateUser.email);
      data.append("latitude", updateUser.latitude);
      data.append("longitude", updateUser.longitude);
      data.append("image", updateUser.image);
      data.append("address", updateUser.address);

      const response = await axios.put(
        `http://122.170.1.83:8899/api/v1/user/${updateUser.id}`,
        data
      );
      console.log(response);
    },

    async displayUser({ commit }, userId) {
      const response = await axios.get(
        `http://122.170.1.83:8899/api/v1/user/${userId}`
      );

      commit("displayUserDetails", response.data.result);
    },

    async deleteUser({ commit }, userId) {
      const response = await axios.delete(
        `http://122.170.1.83:8899/api/v1/user/${userId}`
      );

      commit("deleteNewUser", response.data.result);
    },
  },
});
