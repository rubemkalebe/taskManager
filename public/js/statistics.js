google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
	//ajaxLoadRequest();
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Responsável');
	data.addColumn('number', 'Quantidade');

	var taskRequest = new XMLHttpRequest();
    taskRequest.open('GET', 'http://localhost:8080/tasks');
    taskRequest.onload = function () {
        if (taskRequest.status >= 200 && taskRequest.status < 400) {
            var taskListJson = taskRequest.responseText;
            var table = process(taskListJson);

            data.addRows(table.size);
			var i = 0;
			for(var [key, value] of table) {
				data.setCell(i, 0, key);
				data.setCell(i, 1, value);
				i++;
			}
			
			var options = {
				'title':'Tarefas Pendentes',
		 		'width':400,
		 		'height':400
		 	};
		 	var barChart = new google.visualization.BarChart(document.getElementById('bar_chart'));
		 	barChart.draw(data, options);

		 	var pieChart = new google.visualization.PieChart(document.getElementById('pie_chart'));
		 	pieChart.draw(data, options);
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
    taskRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    taskRequest.send();
}

function ajaxLoadRequest() {
    var taskRequest = new XMLHttpRequest();
    taskRequest.open('GET', 'http://localhost:8080/tasks');
    taskRequest.onload = function () {
        if (taskRequest.status >= 200 && taskRequest.status < 400) {
            taskListJson = taskRequest.responseText;
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
    taskRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    taskRequest.send();
}

function process(data) {
	var map = new Map();
	data = JSON.parse(data);
	for(i = 0; i < data.length; i++) {
		if(map.has(data[i]['responsible'])) {
			map.set(data[i]['responsible'], map.get(data[i]['responsible'])+1);
		} else {
			map.set(data[i]['responsible'], 1);
		}
	}
	return map;
}