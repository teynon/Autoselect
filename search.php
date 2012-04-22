<?php
    $result = array('results' => array());
    $result['results'][] = array("test", "value");
    $result['results'][] = array("test2", "value2");
    
    echo json_encode($result);
