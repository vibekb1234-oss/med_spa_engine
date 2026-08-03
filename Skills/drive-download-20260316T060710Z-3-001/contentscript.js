console.log('LinkedIn Comment Quotation Sender Script Loaded');

// Your webhook URL
const webhookURL = 'https://hook.eu2.make.com/sn496vx9qjxjk5nr0nm85l7d6n2yylxf';

// Function to create the button in the top right corner of the page
function createTopRightButton() {
    const button = document.createElement('button');
    button.id = 'quotation-button';
    button.innerHTML = '💬 Add Comment';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.backgroundColor = '#0073b1'; // LinkedIn blue color
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.zIndex = '10000';
    button.style.fontFamily = "'Avenir', sans-serif"; // Updated font

    // Add event listener to show the selection box
    button.addEventListener('click', () => {
        console.log('Button clicked');
        showQuotationBox();
    });

    document.body.appendChild(button);
}

// Function to show the floating comment selection box with updated design
function showQuotationBox() {
    console.log('Showing the Quotation Box');

    // Remove any existing box
    if (document.getElementById("quotationBox")) {
        document.getElementById("quotationBox").remove();
    }

    // Create the floating box
    let quotationBox = document.createElement("div");
    quotationBox.id = "quotationBox";
    quotationBox.style.position = "fixed";
    quotationBox.style.top = "20%";
    quotationBox.style.right = "5%";
    quotationBox.style.width = "320px";
    quotationBox.style.padding = "0"; // Remove padding to ensure the gradient covers the full top
    quotationBox.style.background = "#ffffff";
    quotationBox.style.borderRadius = "15px";
    quotationBox.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    quotationBox.style.zIndex = "10000";
    quotationBox.style.color = "#333";
    quotationBox.style.display = "flex";
    quotationBox.style.flexDirection = "column";
    quotationBox.style.alignItems = "center";
    quotationBox.style.maxHeight = "600px";
    quotationBox.style.overflowY = "auto";

    // Add a circular close button above the box
    let closeButton = document.createElement('button');
    closeButton.innerText = "✕";
    closeButton.style.position = "fixed"; // Make it fixed to ensure it stays above the box
    closeButton.style.top = "calc(20% - 25px)";  // Position it above the box
    closeButton.style.right = "calc(5% - 25px)";  // Align with the right edge of the box
    closeButton.style.width = "30px";
    closeButton.style.height = "30px";
    closeButton.style.backgroundColor = "#0073b1";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.display = "flex";
    closeButton.style.justifyContent = "center";
    closeButton.style.alignItems = "center";
    closeButton.style.zIndex = "10001"; // Ensure it's above the quotation box
    closeButton.addEventListener('click', () => closeQuotationBox());

    // Add header with gradient background
    let header = document.createElement('div');
    header.style.width = "100%";
    header.style.padding = "15px";
    header.style.background = "linear-gradient(-45deg, #9C27B0, #E91E63, #9C27B0, #E91E63)";
    header.style.backgroundSize = "400% 400%";
    header.style.animation = "gradientAnimation 5s ease infinite";
    header.style.borderTopLeftRadius = "15px";
    header.style.borderTopRightRadius = "15px";
    header.style.color = "#fff";
    header.style.display = "flex";
    header.style.justifyContent = "center"; // Centering the title
    header.style.alignItems = "center";

    let title = document.createElement('h3');
    title.innerText = "LinkedIN Genie";
    title.style.margin = "0";
    title.style.fontFamily = "'Avenir', sans-serif";
    title.style.fontSize = "16px";
    title.style.fontWeight = "bold"; // Bold title
    title.style.color = "white"; // White text color

    header.appendChild(title);
    quotationBox.appendChild(header);

    // Add loading spinner
    let loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner'); // Add spinner class
    loadingSpinner.style.marginTop = "100px"; // Center it vertically
    quotationBox.appendChild(loadingSpinner);

    document.body.appendChild(quotationBox);
    document.body.appendChild(closeButton); // Add close button to the body

    // Load comments after fetching from webhook
    fetchComments(quotationBox, loadingSpinner);
}

// Function to close the quotation box
function closeQuotationBox() {
    const box = document.getElementById("quotationBox");
    if (box) {
        box.remove();
    }
    const closeButton = document.querySelector('button[style*="top: calc(20% - 25px)"]');
    if (closeButton) {
        closeButton.remove();
    }
}

// Function to fetch comments and display them
function fetchComments(quotationBox, loadingSpinner) {
    // Get the post text from various possible selectors
    let postText = '';
    try {
        const postElement = document.querySelector('.feed-shared-update-v2__commentary') || 
                            document.querySelector('.feed-shared-text') || 
                            document.querySelector('.update-components-text') ||
                            document.querySelector('.feed-shared-actor__description');

        if (postElement) {
            postText = postElement.innerText || 'No post text found';
            console.log("Post text captured:", postText);
        } else {
            throw new Error("Post text element not found.");
        }
    } catch (error) {
        console.error("Error capturing post text:", error);
        postText = "Unable to capture post text.";
    }

    // Get all comments
    let comments = [];
    try {
        document.querySelectorAll('.comments-comment-item__main-content').forEach(comment => {
            comments.push(comment.innerText.trim());
        });
        console.log("Comments captured:", comments);
    } catch (error) {
        console.error("Error capturing comments:", error);
    }

    // Combine the post text and comments into one message
    const requestBody = {
        postText: postText,
        comments: comments
    };

    console.log("Sending the following data to the webhook:", requestBody);

    // Send the combined data to the webhook
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.text()) // Handle the response as text
    .then(result => {
        console.log("Webhook response received:", result);

        // Add a check for an empty or unexpected response
        if (!result || result.trim() === "") {
            throw new Error("Received an empty response from the webhook.");
        }

        // Split the response by lines and treat each line as a comment
        const commentsFromWebhook = result.split("\n").filter(line => line.trim() !== "");
        console.log("Comments from Webhook:", commentsFromWebhook); // Debugging line

        // Remove the loading spinner after comments have loaded
        loadingSpinner.remove();

        // Dynamically add comments from the webhook response
        commentsFromWebhook.forEach(comment => {
            let button = document.createElement('button');
            button.className = "commentButton";
            button.innerText = comment;
            button.style.padding = "10px 15px";
            button.style.margin = "10px 15px"; // Added padding on either side
            button.style.width = "calc(100% - 30px)"; // Adjust width to account for padding
            button.style.backgroundColor = "#fff";
            button.style.color = "#333";
            button.style.border = "1px solid #ddd"; // Border around each comment
            button.style.borderRadius = "10px";
            button.style.cursor = "pointer";
            button.style.fontSize = "14px";
            button.style.fontFamily = "'Avenir', sans-serif";
            button.style.textAlign = "left";

            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = "#f0f8ff"; // Slightly change color on hover
                button.style.borderColor = "#ccc"; // Change border color on hover
                button.style.transform = "scale(1.02)";
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = "#fff";
                button.style.borderColor = "#ddd"; // Reset border color
                button.style.transform = "scale(1)";
            });

            button.addEventListener('click', () => {
                insertSelectedComment(button.innerText);
                triggerConfetti();
            });

            quotationBox.appendChild(button);
        });
    })
    .catch(error => {
        console.error('Error fetching comments from webhook:', error);
        alert('Error fetching comments from the webhook. Check the console for details.');
    });
}

// Function to insert the selected comment into the LinkedIn comment box
function insertSelectedComment(comment) {
    const commentBox = document.querySelector('[contenteditable="true"]');
    if (commentBox) {
        commentBox.innerText = comment;
        console.log("Inserted comment into LinkedIn comment box:", comment);
    } else {
        alert("Unable to find the LinkedIn comment box.");
    }
}

// Confetti animation function
function triggerConfetti() {
    const confettiCount = 200;
    const colors = ['#ff6ec4', '#7873f5', '#43e97b', '#f8ff00'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '10000';
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
        document.body.appendChild(confetti);

        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 5000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }

    @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .quotation-header {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        color: #ffffff;
    }

    .gradient-purple {
        background: linear-gradient(-45deg, #9C27B0, #E91E63, #9C27B0, #E91E63);
        background-size: 400% 400%;
        animation: gradientAnimation 5s ease infinite;
    }

    .commentButton:hover {
        background-color: #f0f8ff;
        border-color: #ccc;
        transform: scale(1.02);
    }

    .loading-spinner {
        border: 6px solid #f3f3f3; /* Light grey */
        border-top: 6px solid #0073b1; /* LinkedIn blue */
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto; /* Center horizontally */
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Add the button when the page loads
window.addEventListener('load', () => {
    console.log('Page Loaded, injecting button');
    createTopRightButton();
});
