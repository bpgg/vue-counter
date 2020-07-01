
/**
 * 传统模式
 */
var subBtn = document.getElementById('sub');
var addBtn = document.getElementById('add');
var text = document.getElementById('text');

var count = 0;
text.innerHTML = count;

subBtn.addEventListener('click', function () {
    count--;  // 业务操作
    text.innerHTML = count; // UI渲染
});

addBtn.addEventListener('click', function () {
    count++;
    text.innerHTML = count;
})