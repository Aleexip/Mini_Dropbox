<?php
// PARTEA DE PHP (BACKEND)
// Aceasta parte ruleaza doar cand JavaScript trimite datele

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Setam header-ul pentru a raspunde cu JSON (format de date pentru JS)
    header('Content-Type: application/json');

    $nume = trim($_POST['nume'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $mesaj = trim($_POST['mesaj'] ?? '');
    
    $errors = [];

    [cite_start]// 1. Validare Nume (minim 3 caractere) [cite: 2]
    if (strlen($nume) < 3) {
        $errors['nume'] = "Numele trebuie sa aiba minim 3 caractere.";
    }

    [cite_start]// 2. Validare Email (format valid) [cite: 3]
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Introduceti o adresa de email valida.";
    }

    [cite_start]// 3. Validare Mesaj (minim 10 caractere) [cite: 4]
    if (strlen($mesaj) < 10) {
        $errors['mesaj'] = "Mesajul trebuie sa aiba minim 10 caractere.";
    }

    // Verificam daca exista erori
    if (!empty($errors)) {
        // Trimitem erorile inapoi la JavaScript
        echo json_encode(['success' => false, 'errors' => $errors]);
    } else {
        // Totul este corect - Trimitem succesul
        echo json_encode([
            'success' => true, 
            'nume' => htmlspecialchars($nume), // Protectie XSS
            'mesaj_text' => htmlspecialchars($mesaj)
        ]);
    }
    exit; // Oprim executia scriptului aici pentru a nu returna si HTML-ul de jos
}
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formular Contact</title>
    <style>
        /* Stiluri simple pentru aspect */
        body { font-family: sans-serif; max-width: 500px; margin: 2rem auto; padding: 0 1rem; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; font-weight: bold; margin-bottom: 0.5rem; }
        input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
        button { padding: 10px 20px; background-color: #007BFF; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        
        /* Stiluri pentru erori și succes */
        .error-msg { color: red; font-size: 0.85rem; margin-top: 5px; display: none; }
        #success-container { display: none; background-color: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; }
    </style>
</head>
<body>

    <div id="success-container">
        <h3>Multumesc, <span id="display-name"></span>!</h3>
        <p>Am receptionat mesajul tau:</p>
        <blockquote id="display-message" style="font-style: italic;"></blockquote>
    </div>

    <form id="contactForm">
        <h2>Contacteaza-ne</h2>

        <div class="form-group">
            <label for="nume">Nume:</label>
            <input type="text" id="nume" name="nume" placeholder="Numele tau">
            <div id="error-nume" class="error-msg"></div>
        </div>

        <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" placeholder="exemplu@email.com">
            <div id="error-email" class="error-msg"></div>
        </div>

        <div class="form-group">
            <label for="mesaj">Mesaj:</label>
            <textarea id="mesaj" name="mesaj" rows="5" placeholder="Scrie mesajul aici..."></textarea>
            <div id="error-mesaj" class="error-msg"></div>
        </div>

        <button type="submit">Trimite</button>
    </form>

    <script>

       // PARTEA DE JAVASCRIPT 
        
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Opreste reincarcarea paginii

            // Resetam erorile vizuale
            document.querySelectorAll('.error-msg').forEach(el => {
                el.style.display = 'none';
                el.innerText = '';
            });

            // Colectam datele din formular
            const formData = new FormData(this);

            // Trimitem datele catre acelasi fisier PHP
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Asteptam raspunsul JSON de la PHP
            .then(data => {
                if (data.success) {
                    [cite_start]// Cazul de succes: Ascundem formularul si afisam mesajul [cite: 6]
                    document.getElementById('contactForm').style.display = 'none';
                    document.getElementById('success-container').style.display = 'block';
                    
                    // Populam numele si mesajul
                    document.getElementById('display-name').innerText = data.nume;
                    document.getElementById('display-message').innerText = data.mesaj_text;
                } else {
                    [cite_start]// Cazul de eroare: Afisam erorile sub campurile relevante [cite: 7]
                    for (const [key, msg] of Object.entries(data.errors)) {
                        const errorDiv = document.getElementById('error-' + key);
                        if (errorDiv) {
                            errorDiv.innerText = msg;
                            errorDiv.style.display = 'block';
                        }
                    }
                }
            })
            .catch(error => console.error('Eroare:', error));
        });
    </script>
</body>
</html>