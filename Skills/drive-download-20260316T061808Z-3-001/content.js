console.log('Content script loaded');

function createConfetti() {
    console.log('Creating confetti');
    const confettiCount = 100;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function showConfirmationMessage(message = "Your selected text has been sent successfully.") {
    console.log('Showing confirmation message:', message);
    const messageElement = document.createElement('div');
    messageElement.id = 'highlight-confirmation';
    messageElement.innerHTML = `
        <div class="highlight-header">
            <h3>Text Sent!</h3>
        </div>
        <div class="highlight-content">
            ${message}
        </div>
    `;
    document.body.appendChild(messageElement);
    setTimeout(() => messageElement.remove(), 3000);
}

function sendSelectedText() {
    console.log('sendSelectedText function called');
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        console.log('Selected text:', selectedText);
        createConfetti();
        fetch("https://hook.eu2.make.com/rzc8dik8vqnk1jf9oo2mmplh62ct2b68", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                text: selectedText,
                url: window.location.href
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(responseText => {
            console.log("Response from server:", responseText);
            showConfirmationMessage();
        })
        .catch(error => {
            console.error("Error sending text:", error);
            showConfirmationMessage("Text sent, but there was an issue with the response.");
        });
    } else {
        console.log('No text selected');
        alert("Please select some text to send.");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.action === "getSelectedText") {
        sendSelectedText();
    }
});

// Add styles
const style = document.createElement('style');
style.textContent = `
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: #f00;
        animation: confetti-fall 5s linear infinite;
        z-index: 10000;
    }
    @keyframes confetti-fall {
        0% { transform: translateY(-100vh) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(720deg); }
    }
    #highlight-confirmation {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 250px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        font-family: Arial, sans-serif;
    }
    .highlight-header {
        background: linear-gradient(-45deg, #4CAF50, #8BC34A, #4CAF50, #8BC34A);
        background-size: 400% 400%;
        animation: gradientAnimation 5s ease infinite;
        color: #ffffff;
        padding: 10px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .highlight-header h3 {
        margin: 0;
        font-size: 18px;
    }
    .highlight-content {
        padding: 10px;
    }
    @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);

console.log('Content script finished loading');