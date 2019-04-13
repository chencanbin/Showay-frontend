import { fetchFolderById, fetchFolder } from '@/http/modules/document'

const document = {
  namespaced: true,
  state: {
    folders: [],
    files: []
  },
  mutations: {
    SET_FOLDERS: (state, folders) => {
      state.folders = folders
    },
    SET_FILES: (state, files) => {
      state.files = files
    }
  },
  actions: {
    FetchFolderById({ commit }, { id, params }) {
      return fetchFolderById(id, params).then(res => {
        commit('SET_FOLDERS', res.data)
      })
    },
    FetchFolder({ commit }, { params }) {
      return fetchFolder(params).then(res => {
        commit('SET_FOLDERS', res.data)
      })
    }
  }
}
export default document
