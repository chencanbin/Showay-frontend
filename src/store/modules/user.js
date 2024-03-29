import { logout, getUserInfo, loginByUsername } from '@/http/modules/login'
import { fetchUserList, fetchChannelHierarchy } from '@/http/modules/user'
import { setLoginStatus, removeLoginStatus, setUserId } from '@/utils/auth'

const user = {
  state: {
    user: '',
    channelHierarchy: {},
    status: '',
    code: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    actions: [],
    statItems: [],
    homePageSetting: [],
    paymentStatuses: [],
    users: [],
    id: '',
    userLoading: false,
    channelHierarchyLoading: false
  },

  mutations: {
    SHOW_CHANNEL_HIERARCHY_LOADING: (state) => {
      state.channelHierarchyLoading = true
    },
    HIDE_CHANNEL_HIERARCHY_LOADING: (state) => {
      state.channelHierarchyLoading = false
    },
    SHOW_USER_LOADING: (state) => {
      state.userLoading = true
    },
    HIDE_USER_LOADING: (state) => {
      state.userLoading = false
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ACTIONS: (state, actions) => {
      state.actions = actions
    },
    SET_STAT_ITEMS: (state, statItems) => {
      state.statItems = statItems
    },
    SET_PAYMENT_STATUSES: (state, paymentStatuses) => {
      state.paymentStatuses = paymentStatuses
    },
    SET_USERS: (state, users) => {
      state.users = users
    },
    SET_HOME_PAGE_SETTING: (state, homePageSetting) => {
      state.homePageSetting = homePageSetting
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_CHANNEL_HIERARCHY: (state, channelHierarchy) => {
      state.channelHierarchy = channelHierarchy
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(res => {
          setLoginStatus(true)
          setUserId(res.data.id)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) {
            reject('error')
          }
          const data = response.data
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
            commit('SET_ACTIONS', data.actions)
            commit('SET_STAT_ITEMS', data.statItems)
            commit('SET_PAYMENT_STATUSES', data.paymentStatuses)
            if (data.settings && data.settings.homePage) {
              commit('SET_HOME_PAGE_SETTING', JSON.parse(data.settings.homePage))
            } else {
              commit('SET_HOME_PAGE_SETTING', undefined)
            }
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户列表
    FetchUserList({ commit }, params) {
      commit('SHOW_USER_LOADING')
      return fetchUserList(params).then(res => {
        commit('SET_USERS', res.data)
        commit('HIDE_USER_LOADING')
      }).catch(_ => {
        commit('HIDE_USER_LOADING')
      })
    },

    FetchChannelHierarchy({ commit }, params) {
      commit('SHOW_CHANNEL_HIERARCHY_LOADING')
      commit('SET_CHANNEL_HIERARCHY', {})
      return fetchChannelHierarchy(params).then(res => {
        commit('SET_CHANNEL_HIERARCHY', res.data)
        commit('HIDE_CHANNEL_HIERARCHY_LOADING')
      }).catch(_ => {
        commit('HIDE_CHANNEL_HIERARCHY_LOADING')
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          removeLoginStatus()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeLoginStatus()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
