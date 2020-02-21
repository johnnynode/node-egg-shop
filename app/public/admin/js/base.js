$(function() {
    app.init();
});

var app = {
    init() {
        this.toggleAside();
        this.deleteConfirm();
        this.resizeIframe(); // 初始化调用一次
    },
    toggleAside() {
        $('.aside h4').click(function() {
            if ($(this).find('span').hasClass('nav_close')) {
                $(this).find('span').removeClass('nav_close')
                    .addClass('nav_open');
            } else {
                $(this).find('span').removeClass('nav_open')
                    .addClass('nav_close');
            }
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

    // 修改值的方法
    editVal(el, model, attr, id) {
        const val = $(el).html();
        const input = $("<input value='' />");

        // 把input放在sapn里面
        $(el).html(input);
        // 让input获取焦点  给input赋值
        $(input).trigger('focus').val(val);
        // 点击input的时候阻止冒泡
        $(input).click(function() {
            return false;
        });
        // 鼠标离开的时候给sapn赋值
        $(input).blur(function() {
            const val = $(this).val();
            $(el).html(val);
            // console.log(model,attr,id)
            $.get('/admin/editVal', { model, attr, id, val }, function(data) {
                console.log(data);
            });
        });
    },

    resizeIframe() {
        const heights = document.documentElement.clientHeight - 100;
        document.getElementById('rightMain').height = heights;
    },
};

// 监听窗口变化
$(window).resize(function() {
    app.resizeIframe();
});