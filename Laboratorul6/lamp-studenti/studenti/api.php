<?php

$host = 'mysql';
$db   = 'studenti'; 
$user = 'user'; 
$pass = 'password';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Conexiune eșuată: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM studenti ORDER BY id DESC");
    $studenti = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($studenti);
}


elseif ($method === 'POST') {
 
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['nume'], $data['an'], $data['media'])) {
        $nume = trim($data['nume']);
        $an = (int)$data['an'];
        $media = (float)$data['media'];

        
        if ($an < 1 || $an > 4) {
            echo json_encode(['success' => false, 'message' => 'Anul trebuie să fie între 1 și 4']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO studenti (nume, an, media) VALUES (?, ?, ?)");
        if ($stmt->execute([$nume, $an, $media])) {
            echo json_encode(['success' => true, 'message' => 'Student adăugat!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Eroare la salvare']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Date incomplete']);
    }
}
?>