import { fetchFolderById, fetchFolder } from '@/http/modules/document'

const document = {
  namespaced: true,
  state: {
    fileLoading: false,
    folders: [],
    files: []
  },
  mutations: {
    SHOW_FILE_LOADING: (state) => {
      state.fileLoading = true
    },
    HIDE_FILE_LOADING: (state) => {
      state.fileLoading = false
    },
    SET_FOLDERS: (state, folders) => {
      state.folders = folders
    },
    SET_FILES: (state, files) => {
      state.files = files
    }
  },
  actions: {
    FetchFolderById({ commit }, { id, params }) {
      commit('SHOW_FILE_LOADING')
      commit('SET_FOLDERS', [])
      return fetchFolderById(id, params).then(res => {
        commit('SET_FOLDERS', res.data)
        commit('HIDE_FILE_LOADING')
      }).catch(_ => {
        commit('HIDE_FILE_LOADING')
      })
    },
    FetchFolder({ commit }, { params }) {
      commit('SHOW_FILE_LOADING')
      commit('SET_FOLDERS', [])
      return fetchFolder(params).then(res => {
        commit('SET_FOLDERS', res.data)
        commit('HIDE_FILE_LOADING')
      }).catch(_ => {
        commit('HIDE_FILE_LOADING')
      })
    }
  }
}
export default document
