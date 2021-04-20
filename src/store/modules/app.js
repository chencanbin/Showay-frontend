import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || 'zh-CN',
    size: Cookies.get('size') || 'medium',
    loading: false,
    lTime: new Date().getTime(), // 最后一次点击的时间
    ctTime: new Date().getTime(), // 当前时间
    tWarning: 5 * 60 * 1000, // 超过时间5min
    tOut: 10 * 60 * 1000, // 超时时间10min
    closeTime: 10 * 60 * 1000,
    timeoutDialog: false
  },
  mutations: {
    SET_TIMEOUT_DIALOG: (state, timeoutDialog) => {
      state.timeoutDialog = timeoutDialog;
    },
    SET_L_TIME: (state, lTime) => {
      state.lTime = lTime;
    },
    SET_CT_TIME: (state, ctTime) => {
      state.ctTime = ctTime;
    },
    SET_T_OUT: (state, tOut) => {
      state.tOut = tOut;
    },
    SET_CLOSE_TIME: (state, closeTime) => {
      state.closeTime = closeTime;
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set('language', language);
    },
    SET_SIZE: (state, size) => {
      state.size = size;
      Cookies.set('size', size);
    },
    SHOW_LOADING: (state) => {
      state.loading = true;
    },
    HIDE_LOADING: (state) => {
      state.loading = false;
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device);
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size);
    },
    setTimeoutDialog: ({ commit }, timeoutDialog) => {
      commit('SET_TIMEOUT_DIALOG', timeoutDialog);
    },
    setlTime: ({ commit }, lTime) => {
      commit('SET_L_TIME', lTime);
    },
    setCtTime: ({ commit }, ctTime) => {
      commit('SET_CT_TIME', ctTime);
    },
    setTimeout: ({ commit }, tOut) => {
      commit('SET_T_OUT', tOut);
    },
    setCloseTime: ({ commit }, closeTime) => {
      commit('SET_CLOSE_TIME', closeTime);
    }
  }
};

export default app;
