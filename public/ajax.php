<?php
$data = array('data' => array('feed' => 'Hello World! ***From PHP File***'));
header('Content-Type: application/json');
echo json_encode($data);
?>