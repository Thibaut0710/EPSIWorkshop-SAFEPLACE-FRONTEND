document.addEventListener('DOMContentLoaded', function () {
    // Sélection du bouton
    const button = document.querySelector('button');
    const bodyPart = document.querySelector('.bodypart');  // Sélection de la div bodypart

    // Fonction qui crée et affiche le pop-up
    button.addEventListener('click', function () {

        // Cache la div bodypart
        bodyPart.style.display = 'none';

        // Création du pop-up
        let popup = document.createElement('div');
        popup.className = 'report-popup';
        popup.style.backgroundColor = '#FFFFFF';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        popup.style.color = '#000000'; // Applique le style global pour tout le texte

        // Contenu du pop-up
        popup.innerHTML = `
            <h2 style="color: #000000;">Report content</h2>
            <p style="color: #000000;">Thank you for your report. The selection will be reported to our teams and might be forwarded if needed.</p>
            <p style="color: #000000;">If you want to provide more details about the report, please use the comment section right below.</p>
            <textarea placeholder="Add your comment" style="width: 100%; height: 50px; color: #000000;"></textarea>
            <div style="margin-top: 10px;">
                <label style="color: #000000;">
                    <input type="checkbox" id="blockSession"> Block the content on the computer for this session
                </label><br>
                <label style="color: #000000;">
                    <input type="checkbox" id="blockPermanent"> Block the content on the computer for any session
                </label>
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <button id="cancelButton" style="padding: 5px 15px; border: none; background-color: #ccc; border-radius: 5px;">No, cancel</button>
                <button id="confirmButton" style="padding: 5px 15px; border: none; background-color: #333; color: white; border-radius: 5px;">Yes, confirm</button>
            </div>
        `;

        // Ajout du pop-up au body
        document.body.appendChild(popup);

        // Gestion des événements pour les boutons du pop-up
        document.getElementById('cancelButton').addEventListener('click', function () {
            // Fermeture du pop-up et affichage du contenu de bodypart
            document.body.removeChild(popup);
            bodyPart.style.display = 'block';  // Réaffiche bodypart
        });

        document.getElementById('confirmButton').addEventListener('click', function () {
            // Fermeture du pop-up et affichage du contenu de bodypart
            alert('Merci pour votre signalement');
            document.body.removeChild(popup);
            bodyPart.style.display = 'block';  // Réaffiche bodypart
        });
    });
});
