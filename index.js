// 添加待办
function addToDo() {
    let title = $('#title').val();
    if (title == ''){
        alert("内容不能为空");
    }else {  // 不为空，则加入待办列表
        //获取已有数据
        let dataList = getData();

        // 追加新数据
        let data = {"title":title, "todo":false};
        dataList.push(data);

        // 存入本地
        saveData(dataList);

        //清空form表单
        $('#form')[0].reset();

        //更新界面， 拿最新的数据
        load();
    }
}


// 清空界面数据
function clear() {
    localStorage.clear();
    // 清空后 要重新加载
    load();
}


//加载最新数据
function load() {
    let totalData = getData();  //总
    let todoCount = 0;  //待办数量
    let doneCount = 0;  //已办数量

    $('#todolist').empty();
    $('#donelist').empty();
    for(let i = 0; i < totalData.length; i++){
        // 展示待办
        if(!totalData[i]['todo']){
            $('#todolist').append(`<li draggable="true">
            <input type="checkbox" onchange="modifyStatu(${i},true)">
            <p id="p-${i}" onclick="modifyTitle(${i})">${totalData[i]['title']}</p>
            <a href="javascript:remove(${i})"></a>
            </li>`);
            todoCount++;
        }else {  // 已完成
            $('#donelist').append(`<li draggable="true">
            <input type="checkbox" checked=true onchange="modifyStatu(${i},false)">
            <p id="p-${i}" onclick="modifyTitle(${i})">${totalData[i]['title']}</p>
            <a href="javascript:remove(${i})"></a>
            </li>`);
            doneCount++;
        }
    }

    $('#todocount').text(todoCount);   //  更新待办数量
    $('#donecount').text(doneCount);  // 更新已完成数量

    // 为todolist的每个li 绑定拖拽事件
    let lis=$('#todolist')[0].querySelectorAll('ol li');
	[].forEach.call(lis, function(li) {
		li.addEventListener('dragstart', handleDragStart, false);
		li.addEventListener('dragover', handleDragOver, false);
		li.addEventListener('drop', handleDrop, false);
	});

}

// 保存顺序
function saveSort() {
	let ts= $('#todolist p');
	let ds= $('#donelist p');
	let data=[];
	for(i=0;i<ts.length; i++){
		let todo={"title":ts[i].innerHTML,"done":false};
		data.push(todo);
	}
	for(i=0;i<ds.length; i++){
		let todo={"title":ds[i].innerHTML,"done":true};
		data.push(todo);
	}
	saveData(data);
}

// 保存到localStorage
function saveData(data) {
    localStorage.setItem('todo', JSON.stringify(data));
}


// 获取数据
function getData(){
    let collection=localStorage.getItem("todo");
	if(collection!=null){
		return JSON.parse(collection);
	}
	else return [];
}

//移除 索引为i 的数据
function remove(index){
	let data = getData();
	data.splice(index,1)[0]; //移除该索引的数据
	saveData(data);
	load();
}

// 修改title
function modifyTitle(index){
    let pId='#p-'+index;
    let title = $(pId).text();
    let inputId = '#input-'+index;


    $(pId).html("<input type='text' id=" + "input-" + index + " value=" + title + ">");
    $(inputId).focus();  //获得输入框焦点
    // 失去焦点时，更新数据。
    $(inputId).blur(function () {
        if ($(inputId).val().length == 0){
            $(inputId).val(title);
            alert("内容不能为空");
        }else {
            updateData(index, 'title', $(inputId).val());
        }
    });
}

// 修改状态  待办-》已完成， 完成--》待办
function modifyStatu(index, status){
    updateData(index, 'todo', status);
}

function updateData(index, field, value){
    let totalData = getData();
    let rawData = totalData.splice(index,1)[0];  //取出要修改的数据
    rawData[field] = value;  //更新
    totalData.splice(index,0,rawData);  // 重新插入原来位置
    saveData(totalData);  // 写入本地
    load();  // 重新加载
}

//入口函数
$(function(){
    load();

    $('button').click(function (){
        clear();
        alert("已清空");
    });


});


//拖拽排序
let dragSrcEl = null;
function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
    saveSort();
  }
  return false;
}