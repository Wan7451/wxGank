
Component({
  data: {
    height: 1000,
  },
  properties: {
    heightPer: {
      type: Number, value: 1, observer: function (newVal, oldVal) {
        this.setHeightPercent(newVal);
      }
    },
    autoLoading: {
      type: Boolean, value: true,
    },
    isLoading: {
      type: Boolean, value: false, observer: function (newVal, oldVal) {
        if (newVal) {
          this.refresh();
        } else {
          this.setRefreshComplete();
        }
      }
    },
    isLoadingMore: {
      type: Boolean, value: false, observer: function (newVal, oldVal) {
        if (newVal) {
          this.loadMore();
        } else {
          this.setLoadMoreComplete();
        }
      }
    }
  },
  methods: {
    /**
     * 高度百分比
     */
    setHeightPercent: function (heightPer) {
      var height = wx.getSystemInfoSync().windowHeight * heightPer;
      height = height * (750 / wx.getSystemInfoSync().windowWidth);
      this.setData({
        height: height,
      });
    },
    /**
     * 下拉刷新
     */
    refresh: function () {
      if (this.data.isLoading) return;
      this.setData({
        isLoading: true,
      });
      this.triggerEvent('onDownRefresh')
    },

    /**
     * 下拉刷新完成
     */
    setRefreshComplete: function () {
      this.setData({
        isLoading: false,
      });
    },

    /**
     * 加载更多
     */
    loadMore: function () {
      if (this.data.isLoadingMore) return;

      this.setData({
        isLoadingMore: true,
      });
      this.triggerEvent('onUpRefresh')
    },

    /**
    * 加载更多完成
    */
    setLoadMoreComplete: function () {
      this.setData({
        isLoadingMore: false,
      });
    },

  },

  ready: function () {
    if (this.data.autoLoading) {
      if (this.data.isLoading) return;
      this.setData({
        isLoading: true,
      });
      this.triggerEvent('onDownRefresh')
    }
  },

  detached: function () {
    this.data.isLoading = false;
    this.data.isLoadingMore = false;
  }
})