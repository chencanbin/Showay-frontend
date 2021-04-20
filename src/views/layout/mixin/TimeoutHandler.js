import store from '@/store';
import { parseTime } from '@/utils';

export default {
  computed: {
    lTime() {
      return this.$store.state.app.lTime;
    },
    ctTime() {
      return this.$store.state.app.ctTime;
    },
    tWarning() {
      return this.$store.state.app.tWarning;
    },
    tOut() {
      return this.$store.state.app.tOut;
    },
    closeTime() {
      return this.$store.state.app.closeTime;
    }
  },
  created() {
    this.$store.dispatch('setCloseTime', 10 * 60 * 1000);
  },
  methods: {
    parseTime,
    // handleClickOutside() {
    //   this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    // },
    onPageClicked() {
      this.$store.dispatch('setTimeoutDialog', false);
      this.$store.dispatch('setlTime', new Date().getTime());
      this.$store.dispatch('setCloseTime', this.tOut);
      //
      // this.lTime = new Date().getTime()
      // this.closeTime = this.tOut
    },
    handleTimeoutDialogClose() {
      this.$store.dispatch('setTimeoutDialog', false);
      this.$store.dispatch('setlTime', new Date().getTime());
      this.$store.dispatch('setCloseTime', this.tOut);
    },
    tTime() {
      this.$store.dispatch('setCtTime', new Date().getTime());
      this.$store.dispatch('setCloseTime', this.closeTime - 1000);
      if (this.closeTime <= 0) {
        window.onbeforeunload = null;
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      } else if (this.ctTime - this.lTime > this.tWarning && !this.timeoutDialog) {
        this.$store.dispatch('setTimeoutDialog', true);
      }
    }
  }
};
