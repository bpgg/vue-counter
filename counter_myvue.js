/**
 * @description：乞丐版vue
 */

function MyVue(opt) {
    var data = opt.data()
    var methods = opt.methods;
    var render = opt.render;
    var el = opt.el;

    var self = this;
    // 更新视图
    function updateView() {
        el.innerHTML = render()
    }

    // 初始化数据
    function initData(pData) {
        Object.keys(pData).forEach(function (key) {
            var value = pData[key]
            // 设置数据劫持
            Object.defineProperty(pData, key, {
                get: function () {
                    return value;
                },
                // set函数代替发布订阅模式的视图更新
                set: function (newData) {
                    value = newData;
                    console.log('更新视图')
                    updateView()
                }
            })
            // 将data数据对象代理到myVue实例
            Object.defineProperty(self, key, {
                get: function () {
                    return value;
                },
                set: function (newData) {
                    pData[key] = newData
                }
            })
        })
    }

    // 设置方法代理
    function proxyMethods(pMethods) {
        Object.keys(pMethods).forEach(function (key) {
            Object.defineProperty(self, key, {
                get: function () {
                    return pMethods[key].bind(self)
                }
            })
        })
    }

    initData(data);
    proxyMethods(methods);
    //调用created生命周期
    opt.created.call(self)
    // 挂在dom
    updateView();
    //调用mounted生命周期
    opt.mounted.call(self)
}
// 业务区
var myVue = MyVue({

    // 视图挂载点
    el: document.getElementById('app'),
    // 业务数据定义
    data: function () {
        return {
            count: 0
        }
    },
    render: function () {
        return '<h1>count<span>' + this.count + '<span/><h1>'
    },
    // 生命周期
    created: function () {
        console.log('in created')
    },
    mounted: function () {
        var addBtn = document.getElementById('add-btn')
        var subBtn = document.getElementById('sub-btn')
        addBtn.addEventListener('click', this.add)
        subBtn.addEventListener('click', this.sub)
    },
    // controller
    methods: {
        add: function () {
            this.count++; // 不需手动推动视图更新
        },
        sub: function () {
            this.count--;
        }
    }
});
