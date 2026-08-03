document.getElementById("triggerQuotationBox").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: injectQuotationButton
        });
    });
});

function injectQuotationButton() {
    const webhookURL = 'https://hook.eu2.make.com/sn496vx9qjxjk5nr0nm85l7d6n2yylxf';

    console.log("Injecting Quotation Button next to Smiley Face");

    // Locate the comment section smiley face container
    const smileyFaceContainer = document.querySelector('.comments-comment-box__actions');

    // Ensure the smiley face exists before adding the button
    if (smileyFaceContainer && !document.getElementById("quotationButton")) {
        // Create the button that will trigger the quotation box
        let quotationButton = document.createElement("button");
        quotationButton.id = "quotationButton";
        quotationButton.innerHTML = "💬"; // You can change the button content (emoji or text)
        quotationButton.style.marginLeft = "10px";
        quotationButton.style.background = "transparent";
        quotationButton.style.border = "none";
        quotationButton.style.cursor = "pointer";
        quotationButton.title = "Insert a predefined comment";

        // Append the button next to the smiley face
        smileyFaceContainer.appendChild(quotationButton);

        // Add event listener to show the comment selection box
        quotationButton.addEventListener("click", () => {
            showQuotationBox();
        });
    }

    // Function to show the quotation box when the button is clicked
    function showQuotationBox() {
        console.log("Showing the Quotation Box");

        // Remove any existing box
        if (document.getElementById("quotationBox")) {
            document.getElementById("quotationBox").remove();
        }

        // Create the floating box
        let quotationBox = document.createElement("div");
        quotationBox.id = "quotationBox";
        quotationBox.style.position = "fixed";
        quotationBox.style.bottom = "10px"; // Positioned near the bottom
        quotationBox.style.right = "10px"; // Positioned near the comment box
        quotationBox.style.width = "320px";
        quotationBox.style.padding = "15px";
        quotationBox.style.background = "#ffffff";
        quotationBox.style.border = "1px solid #ccc";
        quotationBox.style.borderRadius = "8px";
        quotationBox.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        quotationBox.style.zIndex = "10000";

        // Populate the box with comment options
        let comment1 = "Experience trumps degrees for UK jobs!";
        let comment2 = "This is eye-opening! I wonder how international students can gain relevant experience if they're studying full-time. Are there any tips for balancing studies with work experience?";
        let comment3 = "Interesting perspective on UK job market. While experience is crucial, I think a degree still adds value. It'd be great to see some statistics on how many international students actually land jobs solely based on experience versus those with both experience and UK degrees.";

        quotationBox.innerHTML = `
            <h4 style="margin-top: 0;">Select a Comment</h4>
            <label><input type="radio" name="comment" value="${comment1}"> Comment 1</label><br>
            <label><input type="radio" name="comment" value="${comment2}"> Comment 2</label><br>
            <label><input type="radio" name="comment" value="${comment3}"> Comment 3</label><br>
            <button id="sendComment" style="margin-top: 10px; padding: 5px 10px;">Send</button>
            <button id="closeBox" style="margin-top: 10px; padding: 5px 10px; float: right;">Close</button>
        `;

        document.body.appendChild(quotationBox);

        // Handle closing the box
        document.getElementById("closeBox").addEventListener("click", () => {
            document.body.removeChild(quotationBox);
        });

        // Handle sending the selected comment to the webhook and getting a response
        document.getElementById("sendComment").addEventListener("click", () => {
            let selectedComment = document.querySelector('input[name="comment"]:checked');
            if (selectedComment) {
                let data = {
                    comment: selectedComment.value
                };

                console.log("Selected comment: ", data.comment);

                // Sending the selected comment to the webhook
                fetch(webhookURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    console.log("Webhook request sent. Awaiting response...", response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log("Webhook response received:", result);
                    alert("Webhook response received!");

                    // Insert response into LinkedIn comment box
                    insertResponseIntoLinkedIn(result.response);
                    document.body.removeChild(quotationBox); // Close the box after sending
                })
                .catch(error => {
                    console.error('Error sending comment:', error);
                    alert("Failed to send comment. Check the console for errors.");
                });
            } else {
                alert("Please select a comment.");
            }
        });

        // Function to insert response into the LinkedIn comment box
        function insertResponseIntoLinkedIn(responseText) {
            // Locate the LinkedIn comment box
            const commentBox = document.querySelector('.comments-comment-box__comment--text-editor');
            if (commentBox) {
                commentBox.innerText = responseText; // Insert response into the comment box
                console.log("Inserted response into LinkedIn comment box:", responseText);
            } else {
                alert("Unable to find the LinkedIn comment box.");
            }
        }
    }
}
