<?php
$tarefas = null;

echo "PHP OK1\n";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	echo "PHP OK2\n";
    if(!empty($_POST['tarefas'])) {
        $tarefas = $_POST['tarefas'];
        echo "PHP OK3 tarefas=".$tarefas."\n";
        $users = fopen("tasks.json","w+") or die("unable to open file!");
        echo "PHP OK4\n";
        fwrite($users, $tarefas);
        fclose($users);
    } else {
        echo "Valores a adicionar estão vazios. Nada a inserir!";
    }
} 
?>
