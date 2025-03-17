// This script will capture a screenshot of the game
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the game to load
    setTimeout(() => {
        // Get the canvas
        const canvas = document.getElementById('game-canvas');
        
        // Capture the image
        const screenshot = canvas.toDataURL('image/png');
        
        // Display the image link for download
        const link = document.createElement('a');
        link.href = screenshot;
        link.download = 'screenshot.png';
        link.textContent = 'Download Screenshot';
        link.style.position = 'absolute';
        link.style.bottom = '10px';
        link.style.left = '10px';
        link.style.background = 'white';
        link.style.padding = '5px';
        link.style.borderRadius = '5px';
        link.style.zIndex = '9999';
        document.body.appendChild(link);
        
        // Automatically download
        link.click();
        
        // Remove the link after download
        setTimeout(() => {
            document.body.removeChild(link);
        }, 3000);
    }, 1000);
});