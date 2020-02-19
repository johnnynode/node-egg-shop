$(function() {
  app.init();
});

var app = {
  init() {
    this.toggleAside();
    this.deleteConfirm();
  },
  toggleAside() {
    $('.aside h4').click(function() {
      $(this).siblings('ul').slideToggle();
    });
  },

  changeStatus(el, model, attr, id) {
    // 此处点击最好加上一个函数节流，防止用户点击频率过快给服务器造成响应压力
    $.get('/admin/changeStatus', { model, attr, id }, function(data) {
      if (data.success) {
		  el.src = '/public/admin/images/' + (data.status ? 'yes.gif' : 'no.gif');
      }
    });
  },

  deleteConfirm() {
    $('.delete').click(function() {
      return confirm('您确定要删除吗?');
    });
  },
};
