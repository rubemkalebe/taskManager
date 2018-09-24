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
	todo_array.push({
		'description' : task_description.value,
		'responsible' : task_responsible.value,
		'deadline' : task_deadline.value
	});
	console.log("Adding task: " + JSON.stringify(todo_array[todo_array.length-1]));

	var item = document.createElement("li");
	
	var label = document.createElement("label");
	label.innerText = task_description.value;

	var checkBox = document.createElement("input");
	checkBox.type = "checkbox";
	checkBox.onchange = completeTask;

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

	todo_list.appendChild(item);

	reset();

	new_task_modal.style.display = "none";
}

var completeTask = function() {
	var item = this.parentNode;
	var content = item.querySelector("label").innerText;
	console.log("Complete task: " + content);
	done_list.appendChild(item);

	item.querySelector("label").innerHTML = "<del>" + content + "</del>";

	item.querySelector("input[type=checkbox]").onchange = uncompleteTask;
}

var uncompleteTask = function() {
	var item = this.parentNode;
	var content = item.querySelector("label").innerText;
	console.log("Uncomplete task: " + content);
	todo_list.appendChild(item);

	item.querySelector("label").innerHTML = content;

	item.querySelector("input[type=checkbox]").onchange = completeTask;
}

var deleteTask = function() {
	var item = this.parentNode;
	var list = item.parentNode;
	var content = item.querySelector("label").innerText;
	console.log("Delete task: " + content);
	list.removeChild(item);
}

var editTask = function() {
	new_task_modal.style.display = "block";

	var item = this.parentNode;
	item2edit = item;
	var content = item.querySelector("label").innerText;
	task_description.value = content;
}

edit_task.onclick = function(event) {
	var item = item2edit;
	var content = item2edit.querySelector("label").innerText;
	console.log("Editing task: " + content);

	item2edit.querySelector("label").innerText = task_description.value;

	reset();
	item2edit = null;

	new_task_modal.style.display = "none";
}

var reset = function() {
	task_description.value = "";
	task_responsible.value = "";
	task_deadline.value = "";
}