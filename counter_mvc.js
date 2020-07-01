/**
 * @description mvc模式
 */

/**
 * 业务数据
 */
function createModel() {
    // 业务数据存储的对象
    var data = {}  // 闭包对象
    // 事件集合对象
    var events = {}
    return {
        register: function (event, handler) {
            var handlers = events[event];
            if (handlers) {
                //存放用户的某一类服务下的具体服务事项
                handlers.push(handler);
            } else {
                events[event] = [handler];
            }
        },
        // model对象暴露给外界，用来获取业务数据的方法。
        getData: function (key) {
            return data[key]
        },

        setData: function (key, value) {
            data[key] = value;
            this.notify(key, value);//通知view层，业务数据已经更新，请更新视图。
        },
        // 发布者处理完某类服务，通知订阅者。
        // 订阅者们订阅了某双鞋子，发布者备货完毕，通知订阅者货到了，并把鞋子的基本信息发送出去。
        // 订阅者，可以根据传递过来的鞋子信息参数，在处理函数里面做更新。
        notify: function (key, value) {
            var handlers = events[key];
            handlers && handlers.forEach(function (handler) {
                // view的更新视图方法
                handler(value);
            })
        }
    }
}
/**
 * 业务处理
 * 在control里面编写业务处理函数，以及控制model业务数据变更。
 */

function createCtrl(model) {

    return {
        // 业务处理
        add: function () {
            // 获取业务对象的状态
            var count = model.getData('count')
            // 更新值
            count++;
            console.log('业务处理' + count)
            // 更新业务对象状态
            model.setData('count', count)
        },
        sub: function () {
            var count = model.getData('count')
            count--;
            model.setData('count', count)
        }
    }
}

/**
 * 在视图函数中处理页面渲染，事件监听
 */

function createView(model, ctrl) {
    var subBtn, addBtn, text;
    // renders对象保存了视图更新函数。
    var renders = {
        updateCount: function (value) {
            text.innerText = value;
        }
    }
    // eventHandler,保存按钮的事件监听，将监听事件里面具体业务处理转交给controller对象。
    var eventHandler = {
        add: function () {
            ctrl.add.call(this)
        },
        sub: function () {
            ctrl.sub.call(this)
        }
    }
    // view 对象
    return {
        // 初始化界面
        init: function () {

            addBtn = document.getElementById('add')
            subBtn = document.getElementById('sub')
            text = document.getElementById('text')

            addBtn.addEventListener('click', eventHandler.add)
            subBtn.addEventListener('click', eventHandler.sub)
            // 注册服务，订阅count，count有改变，触发更新方法
            model.register('count', renders.updateCount)
            // 设置初始化值，同时也是给界面上的值做更新
            model.setData('count', 0)

        },
        destory: function () {
            addBtn.removeEventListenter('click', eventHandler.add)
            subBtn.removeEventListenter('click', eventHandler.sub)

            subBtn = addBtn = text = null
        }
    }
}

var model = createModel()
var ctrl = createCtrl(model)
var view = createView(model, ctrl)

view.init()