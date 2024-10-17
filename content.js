function addReportButton(post) {
    if (!post.querySelector('.report-button')) {
        let button = document.createElement('button');
        button.innerText = 'Signaler';
        button.className = 'report-button';
        button.style.position = 'absolute';
        button.style.top = '5px';
        button.style.right = '50px';
        button.style.padding = '5px';
        button.style.backgroundColor = '#000000';
        button.style.color = '#FFFFFF';
        button.style.border = 'solid white 1px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        post.style.position = 'relative';
        button.style.pointerEvents = 'auto';

        button.addEventListener('click', function() {
            openReportPopup(post);
        });
        
        post.appendChild(button);
    }
}

function openReportPopup(post) {
    let overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
  
    let popup = document.createElement('div');
    popup.className = 'report-popup';
    popup.style.width = '400px';
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
        <label style="color: #000000;"><input type="checkbox" id="blockSession"> Block the content on the computer for this session</label><br>
        <label style="color: #000000;"><input type="checkbox" id="blockPermanent"> Block the content on the computer for any session</label>
    </div>
    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <button id="cancelButton" style="padding: 5px 15px; border: none; background-color: #ccc; border-radius: 5px;">No, cancel</button>
        <button id="confirmButton" style="padding: 5px 15px; border: none; background-color: #333; color: white; border-radius: 5px;">Yes, confirm</button>
    </div>
    `;
  
    document.body.appendChild(overlay);
    overlay.appendChild(popup);
  
    document.getElementById('cancelButton').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
  
    document.getElementById('confirmButton').addEventListener('click', function() {
      let blockSession = document.getElementById('blockSession').checked;
      let blockPermanent = document.getElementById('blockPermanent').checked;
  
      if (blockSession || blockPermanent) {
        post.style.display = 'none';
        alert("Merci pour votre signalement. Le post va être masqué est sera traité par nos équipes.");
      }else{
        alert("Merci pour votre signalement. Le post sera traité par nos équipes.");
      }
  
      document.body.removeChild(overlay);
    });
}

function addButtonsToAllPosts() {
    let posts = document.querySelectorAll('article');
    posts.forEach(post => {
      addReportButton(post);
    });
}

addButtonsToAllPosts();

let observer = new MutationObserver(addButtonsToAllPosts);
observer.observe(document.body, { childList: true, subtree: true });
