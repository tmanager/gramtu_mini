Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isOpened: Boolean,
    list: Array,
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: ['操作1', '操作2']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({
        isOpened: false
      })
      wx.showTabBar()
      this.triggerEvent('cancel');
    },

    handClick(e) {
      if (e.currentTarget.dataset.disable == "1") return;
      this.triggerEvent('select', e.currentTarget.dataset.idx);
    },
  }
})