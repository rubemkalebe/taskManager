var new_task_modal = document.getElementById("new_task_modal");
var new_task_btn = document.getElementById("new_task_btn");

var task_description = document.getElementById("task_description");
var task_responsible = document.getElementById("task_responsible");
var task_deadline = document.getElementById("task_deadline");
var insert_task = document.getElementById("insert_task");
var edit_task = document.getElementById("edit_task");

var todo_list = document.getElementById("todo_list");
var done_list = document.getElementById("done_list");

var todo_array = []
var done_array = []

var item2edit = null;
var task2edit = null;

/* Modal example found in https://www.w3schools.com/howto/howto_css_modals.asp */
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
new_task_btn.onclick = function() {
    new_task_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    new_task_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == new_task_modal) {
        new_task_modal.style.display = "none";
    }
}

insert_task.onclick = function(event) {
	taskListObj.push({
		'id' : taskListObj[taskListObj.length-1]['id']+1,
		'description' : task_description.value,
		'responsible' : task_responsible.value,
		'deadline' : task_deadline.value,
		'list' : "todo"
	});
	console.log("Adding task: " + JSON.stringify(taskListObj[taskListObj.length-1]));
	updateOnServer();	
	new_task_modal.style.display = "none";
}

var updateOnServer = function() {
	var taskRequest = new XMLHttpRequest();
    //taskRequest.open('POST', 'main.php', true);
    taskRequest.open('POST', 'http://localhost:8080/tasks', true);
    taskRequest.onload = function() {
        if (taskRequest.status >= 200 && taskRequest.status < 400) {
            console.log("Sucesso em ajax: " + taskRequest.responseText);
            render(taskListObj);
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
    taskRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    taskRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var taskListJson = JSON.stringify(taskListObj),
        queryString = "tarefas=" + taskListJson;
    localStorage.setItem('taskList',taskListJson);
    taskRequest.send(queryString);
}

var completeTask = function() {
	var item = this.parentNode;
	var content = item.querySelector("label").innerText;
	console.log("Complete task: " + content);
	done_list.appendChild(item);

	item.querySelector("label").innerHTML = "<del>" + content + "</del>";

	item.querySelector("input[type=checkbox]").onchange = uncompleteTask;

	task2edit = getTaskByDesc(content)[0];
	task2edit['list'] = "done";

	updateTaskListObj();
	updateOnServer();

	task2edit = null;
}

var uncompleteTask = function() {
	var item = this.parentNode;
	var content = item.querySelector("label").innerText;
	console.log("Uncomplete task: " + content);
	todo_list.appendChild(item);

	item.querySelector("label").innerHTML = content;

	item.querySelector("input[type=checkbox]").onchange = completeTask;

	task2edit = getTaskByDesc(content)[0];
	task2edit['list'] = "todo";

	updateTaskListObj();
	updateOnServer();

	task2edit = null;
}

var deleteTask = function() {
	var item = this.parentNode;
	var list = item.parentNode;
	var content = item.querySelector("label").innerText;
	console.log("Delete task: " + content);
	list.removeChild(item);
	var index = indexOfTask(getTaskByDesc(content)[0]);
	taskListObj.splice(index, 1);
	updateOnServer();
}

var editTask = function() {
	new_task_modal.style.display = "block";

	var item = this.parentNode;
	var content = item.querySelector("label").innerText;
	item2edit = item;
	task2edit = getTaskByDesc(content)[0];

	task_description.value = task2edit['description'];
	task_responsible.value = task2edit['responsible'];
	task_deadline.value = task2edit['deadline'];
}

edit_task.onclick = function(event) {
	console.log("Editing task: " + task2edit['description']);

	item2edit.querySelector("label").innerText = task_description.value;

	task2edit['description'] = task_description.value;
	task2edit['responsible'] = task_responsible.value;
	task2edit['deadline'] = task_deadline.value;

	updateTaskListObj();
	updateOnServer();

	reset();
	item2edit = null;
	task2edit = null;

	new_task_modal.style.display = "none";
}

function updateTaskListObj() {
	for(i = 0; i < taskListObj.length; i++) {
		if(task2edit['id'] == taskListObj[i]['id']) {
			taskListObj[i] = task2edit;
		}
	}
}

var reset = function() {
	task_description.value = "";
	task_responsible.value = "";
	task_deadline.value = "";
}

function ajaxLoadRequest() {
    var taskRequest = new XMLHttpRequest();
    //taskRequest.open('GET', 'tasks.json');
    taskRequest.open('GET', 'http://localhost:8080/tasks');
    taskRequest.onload = function () {
        if (taskRequest.status >= 200 && taskRequest.status < 400) {
            var taskListJson = taskRequest.responseText;
            localStorage.setItem('taskList',taskListJson);
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
    taskRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    taskRequest.send();  
}

function render(data) {

	todo_list.innerHTML = "";
	done_list.innerHTML = "";

	for(i = 0; i < data.length; i++) {
		var item = document.createElement("li");
		
		var label = document.createElement("label");
		if(data[i]['list'].localeCompare("todo") == 0) {
			label.innerText = data[i].description;
		} else {
			label.innerHTML = "<del>" + data[i].description + "</del>";
		}		

		var checkBox = document.createElement("input");
		checkBox.type = "checkbox";
		if(data[i]['list'].localeCompare("todo") == 0) {
			checkBox.onchange = completeTask;
		} else {
			checkBox.onchange = uncompleteTask;
			checkBox.checked = true;
		}

		var editButton = document.createElement("button");
		editButton.innerText = "Editar";
		editButton.className = "edit";
		editButton.onclick = editTask;

		var deleteButton = document.createElement("button");
		deleteButton.innerText = "Remover";
		deleteButton.className = "delete";
		deleteButton.onclick = deleteTask;
		
		item.appendChild(checkBox);
		item.appendChild(label);
		item.appendChild(editButton);
		item.appendChild(deleteButton);

		if(data[i]['list'].localeCompare("todo") == 0) {
			todo_list.appendChild(item);
		} else {
			done_list.appendChild(item);
		}
    }

	reset();
}

function getTaskByDesc(desc) {
	return taskListObj.filter(
		function(data){return data.description == desc}
	);
}

function indexOfTask(task) {
	for(i = 0; i < taskListObj.length; i++) {
		if(task['id'] == taskListObj[i]['id']) {
			return i;
		}
	}
}


ajaxLoadRequest();
var tasks = localStorage.getItem('taskList');
var taskListObj = JSON.parse(tasks);
render(taskListObj);