document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const gameOverScreen = document.getElementById('game-over');
    const gameStartScreen = document.getElementById('game-start');
    const restartButton = document.getElementById('restart-button');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');

    // Set canvas dimensions
    canvas.width = 360;
    canvas.height = 640;

    // Game state
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let animationId;

    // Title bar properties
    const titleBar = {
        height: 40,
        draw() {
            // Background
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, this.height);
            
            // Title text
            ctx.fillStyle = '#ecf0f1';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Flappy Sales: Technical Trials', canvas.width / 2, this.height / 2 + 6);
            
            // Bottom border
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(0, this.height - 2, canvas.width, 2);
            
            // Reset text alignment
            ctx.textAlign = 'left';
        }
    };

    // Solutions Engineer character
    const se = {
        x: 80,
        y: canvas.height / 2 - 20,
        width: 50,  // Slightly wider for better sprite
        height: 50, // Slightly taller for better sprite
        velocity: 0,
        gravity: 0.35,     // Reduced gravity
        jumpStrength: -7,  // Gentle jump
        
        draw() {
            // SE body
            ctx.fillStyle = '#3498db'; // Blue shirt
            ctx.fillRect(this.x + 10, this.y + 15, 30, 25); // Torso
            
            // Head
            ctx.fillStyle = '#f5d7b5'; // Skin tone
            ctx.fillRect(this.x + 15, this.y, 20, 15); // Head
            
            // Hair
            ctx.fillStyle = '#4a320a'; // Brown hair
            ctx.fillRect(this.x + 15, this.y, 20, 5); // Hair top
            ctx.fillRect(this.x + 13, this.y, 2, 10); // Side hair left
            ctx.fillRect(this.x + 35, this.y, 2, 10); // Side hair right
            
            // Glasses
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + 15, this.y + 8, 8, 2); // Left lens frame top
            ctx.fillRect(this.x + 27, this.y + 8, 8, 2); // Right lens frame top
            ctx.fillRect(this.x + 15, this.y + 13, 8, 2); // Left lens frame bottom
            ctx.fillRect(this.x + 27, this.y + 13, 8, 2); // Right lens frame bottom
            ctx.fillRect(this.x + 15, this.y + 8, 2, 7); // Left lens frame left
            ctx.fillRect(this.x + 21, this.y + 8, 2, 7); // Left lens frame right
            ctx.fillRect(this.x + 27, this.y + 8, 2, 7); // Right lens frame left
            ctx.fillRect(this.x + 33, this.y + 8, 2, 7); // Right lens frame right
            ctx.fillRect(this.x + 23, this.y + 9, 4, 1); // Bridge
            
            // Laptop
            ctx.fillStyle = '#34495e'; // Dark laptop base
            ctx.fillRect(this.x + 8, this.y + 32, 34, 3);  // Laptop base
            ctx.fillStyle = '#95a5a6'; // Screen
            ctx.fillRect(this.x + 12, this.y + 25, 26, 7); // Laptop screen
            ctx.fillStyle = '#2c3e50'; // Screen content
            ctx.fillRect(this.x + 14, this.y + 27, 22, 3); // Screen details
            
            // Arms
            ctx.fillStyle = '#f5d7b5'; // Skin tone
            ctx.fillRect(this.x + 5, this.y + 20, 5, 20);  // Left arm
            ctx.fillRect(this.x + 40, this.y + 20, 5, 20); // Right arm
            
            // Pocket protector and pens
            ctx.fillStyle = '#e74c3c'; // Red pocket
            ctx.fillRect(this.x + 12, this.y + 17, 6, 8); // Pocket
            ctx.fillStyle = '#2ecc71'; // Green pen
            ctx.fillRect(this.x + 13, this.y + 15, 1, 6); // Left pen
            ctx.fillStyle = '#3498db'; // Blue pen
            ctx.fillRect(this.x + 15, this.y + 15, 1, 6); // Middle pen
            ctx.fillStyle = '#f1c40f'; // Yellow pen
            ctx.fillRect(this.x + 17, this.y + 15, 1, 6); // Right pen
            
            // Badge/ID
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(this.x + 32, this.y + 17, 6, 8); // ID card
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x + 33, this.y + 19, 4, 4); // ID photo
            
            // Thought bubble (occasionally showing "Technical Win!")
            if (gameStarted && !gameOver && Math.random() < 0.01) {
                this.drawThoughtBubble("Technical Win!", 80, -30);
            }
        },
        
        drawThoughtBubble(text, offsetX, offsetY) {
            const bubbleX = this.x + offsetX;
            const bubbleY = this.y + offsetY;
            const bubbleWidth = 100;
            const bubbleHeight = 30;
            
            // Bubble background
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            
            // Draw rounded rectangle
            ctx.beginPath();
            ctx.moveTo(bubbleX + 10, bubbleY);
            ctx.lineTo(bubbleX + bubbleWidth - 10, bubbleY);
            ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + 10);
            ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - 10);
            ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight);
            ctx.lineTo(bubbleX + 10, bubbleY + bubbleHeight);
            ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - 10);
            ctx.lineTo(bubbleX, bubbleY + 10);
            ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + 10, bubbleY);
            ctx.fill();
            ctx.stroke();
            
            // Bubble tail
            ctx.beginPath();
            ctx.moveTo(bubbleX + 20, bubbleY + bubbleHeight);
            ctx.lineTo(bubbleX + 10, bubbleY + bubbleHeight + 10);
            ctx.lineTo(bubbleX + 30, bubbleY + bubbleHeight);
            ctx.fill();
            ctx.stroke();
            
            // Text
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 + 4);
            
            // Reset text alignment
            ctx.textAlign = 'left';
        },
        
        update() {
            // Apply gravity
            this.velocity += this.gravity;
            this.y += this.velocity;
            
            // Ceiling check - don't let SE go above the title bar
            if (this.y < titleBar.height) {
                this.y = titleBar.height;
                this.velocity = 0;
            }
            
            // Floor check - game over if hit bottom
            if (this.y + this.height > canvas.height) {
                this.y = canvas.height - this.height;
                this.velocity = 0;
                if (gameStarted && !gameOver) {
                    endGame();
                }
            }
        },
        
        jump() {
            this.velocity = this.jumpStrength;
        }
    };

    // Obstacles (Account Executives)
    const obstacles = [];
    const obstacleInterval = 170; // Frames between obstacles
    let frameCount = 0;

    // Speech bubbles for AEs
    const speechPhrases = [
        "Let's clash calendars!",
        "Need to reschedule!",
        "Meeting with client!",
        "I need a demo!",
        "Urgent call!",
        "Where's my deck?",
        "Need help NOW!",
        "Pipeline review!",
        "QBR due today!",
        "Discovery call!"
    ];

    class Obstacle {
        constructor() {
            this.width = 70;
            this.gap = 250;
            this.x = canvas.width;
            
            // Randomize gap position (not too high or low)
            const minGapPosition = titleBar.height + 130;
            const maxGapPosition = canvas.height - 150 - this.gap;
            this.topHeight = Math.floor(Math.random() * (maxGapPosition - minGapPosition)) + minGapPosition;
            
            this.bottomY = this.topHeight + this.gap;
            this.bottomHeight = canvas.height - this.bottomY;
            this.speed = 2;
            this.passed = false;
            
            // Random speech phrases for both obstacles
            this.topSpeech = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
            this.bottomSpeech = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
            
            // Speech bubble visibility timers
            this.topSpeechVisible = true;
            this.bottomSpeechVisible = true;
            
            // Randomize which AE is talking (maybe only one talks at a time)
            if (Math.random() < 0.5) {
                this.topSpeechVisible = false;
            } else if (Math.random() < 0.5) {
                this.bottomSpeechVisible = false;
            }
        }
        
        draw() {
            // Draw top AE
            this.drawAE(this.x, this.topHeight - 80, true);
            
            // Draw bottom AE
            this.drawAE(this.x, this.bottomY + 10, false);
            
            // Draw speech bubbles
            if (this.topSpeechVisible && this.x < canvas.width - 100 && this.x > se.x - 150) {
                this.drawSpeechBubble(this.x + this.width, this.topHeight - 80, this.topSpeech, false);
            }
            
            if (this.bottomSpeechVisible && this.x < canvas.width - 100 && this.x > se.x - 150) {
                this.drawSpeechBubble(this.x + this.width, this.bottomY + 30, this.bottomSpeech, true);
            }
        }
        
        drawSpeechBubble(x, y, text, isBottom) {
            const bubbleWidth = 120;
            const bubbleHeight = 40;
            const bubbleX = x;
            const bubbleY = isBottom ? y : y - bubbleHeight;
            
            // Bubble background
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            
            // Draw rounded rectangle
            ctx.beginPath();
            ctx.moveTo(bubbleX + 10, bubbleY);
            ctx.lineTo(bubbleX + bubbleWidth - 10, bubbleY);
            ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + 10);
            ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - 10);
            ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight);
            ctx.lineTo(bubbleX + 10, bubbleY + bubbleHeight);
            ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - 10);
            ctx.lineTo(bubbleX, bubbleY + 10);
            ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + 10, bubbleY);
            ctx.fill();
            ctx.stroke();
            
            // Bubble tail
            ctx.beginPath();
            if (isBottom) {
                // Tail points up
                ctx.moveTo(bubbleX - 10, bubbleY);
                ctx.lineTo(bubbleX, bubbleY + 15);
                ctx.lineTo(bubbleX + 10, bubbleY);
            } else {
                // Tail points down
                ctx.moveTo(bubbleX - 10, bubbleY + bubbleHeight);
                ctx.lineTo(bubbleX, bubbleY + bubbleHeight - 15);
                ctx.lineTo(bubbleX + 10, bubbleY + bubbleHeight);
            }
            ctx.fill();
            ctx.stroke();
            
            // Text
            ctx.fillStyle = '#2c3e50';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            
            // If text is too long, split it
            if (text.length > 15) {
                const midpoint = Math.floor(text.length / 2);
                let splitIndex = text.lastIndexOf(' ', midpoint);
                if (splitIndex === -1) splitIndex = midpoint;
                
                const line1 = text.substring(0, splitIndex);
                const line2 = text.substring(splitIndex + 1);
                
                ctx.fillText(line1, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 - 5);
                ctx.fillText(line2, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 + 10);
            } else {
                ctx.fillText(text, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 + 5);
            }
            
            // Reset text alignment
            ctx.textAlign = 'left';
        }
        
        drawAE(x, y, isTop) {
            // AE Body (base)
            ctx.fillStyle = '#2c3e50'; // Dark suit
            ctx.fillRect(x + 15, y, 40, 60); // Suit body
            
            // Head
            ctx.fillStyle = '#f5d7b5'; // Skin tone
            ctx.fillRect(x + 25, y - 20, 20, 20); // Head
            
            // Hair
            ctx.fillStyle = '#2c3e50'; // Dark hair
            ctx.fillRect(x + 25, y - 20, 20, 5); // Hair top
            
            // Face
            ctx.fillStyle = 'black';
            ctx.fillRect(x + 30, y - 12, 2, 2); // Left eye
            ctx.fillRect(x + 38, y - 12, 2, 2); // Right eye
            ctx.fillRect(x + 32, y - 7, 6, 2); // Mouth
            
            // Shirt and tie
            ctx.fillStyle = 'white';
            ctx.fillRect(x + 25, y, 20, 30); // Shirt
            ctx.fillStyle = '#e74c3c'; // Red tie
            ctx.fillRect(x + 32, y, 6, 30); // Tie
            
            // Arms
            ctx.fillStyle = '#2c3e50'; // Suit color
            ctx.fillRect(x + 5, y + 10, 10, 30); // Left arm
            ctx.fillRect(x + 55, y + 10, 10, 30); // Right arm
            
            // Hands
            ctx.fillStyle = '#f5d7b5'; // Skin tone
            ctx.fillRect(x + 5, y + 40, 10, 5); // Left hand
            ctx.fillRect(x + 55, y + 40, 10, 5); // Right hand
            
            // Calendar
            ctx.fillStyle = 'white';
            ctx.fillRect(x + 15, y + 65, 40, 30); // Calendar base
            
            // Calendar header
            ctx.fillStyle = '#e74c3c'; // Red header
            ctx.fillRect(x + 15, y + 65, 40, 5);
            
            // Calendar grid
            ctx.fillStyle = 'black';
            
            // Vertical lines
            ctx.fillRect(x + 25, y + 70, 1, 25); // V line 1
            ctx.fillRect(x + 35, y + 70, 1, 25); // V line 2
            ctx.fillRect(x + 45, y + 70, 1, 25); // V line 3
            
            // Horizontal lines
            ctx.fillRect(x + 15, y + 75, 40, 1); // H line 1
            ctx.fillRect(x + 15, y + 85, 40, 1); // H line 2
            
            // Calendar entries (meetings)
            ctx.fillStyle = '#3498db'; // Blue meetings
            
            // Random meeting placements
            if (Math.random() > 0.5) ctx.fillRect(x + 17, y + 72, 7, 2);
            if (Math.random() > 0.5) ctx.fillRect(x + 27, y + 72, 7, 2);
            if (Math.random() > 0.5) ctx.fillRect(x + 37, y + 72, 7, 2);
            if (Math.random() > 0.5) ctx.fillRect(x + 47, y + 72, 7, 2);
            
            if (Math.random() > 0.5) ctx.fillRect(x + 17, y + 77, 7, 7);
            if (Math.random() > 0.5) ctx.fillRect(x + 27, y + 77, 7, 7);
            if (Math.random() > 0.5) ctx.fillRect(x + 37, y + 77, 7, 7);
            if (Math.random() > 0.5) ctx.fillRect(x + 47, y + 77, 7, 7);
            
            if (Math.random() > 0.5) ctx.fillRect(x + 17, y + 87, 7, 7);
            if (Math.random() > 0.5) ctx.fillRect(x + 27, y + 87, 7, 7);
            if (Math.random() > 0.5) ctx.fillRect(x + 37, y + 87, 7, 7);
            if (Math.random() > 0.5) ctx.fillRect(x + 47, y + 87, 7, 7);
        }
        
        update() {
            this.x -= this.speed;
            
            // Award point if SE passes the obstacle
            if (!this.passed && this.x + this.width < se.x) {
                this.passed = true;
                score++;
                scoreDisplay.textContent = score;
            }
            
            // Forgiving collision detection
            const collisionMargin = 8; // Bigger margin = more forgiving
            if (
                // SE right edge past obstacle left edge
                se.x + se.width - collisionMargin > this.x &&
                // SE left edge before obstacle right edge
                se.x + collisionMargin < this.x + this.width &&
                // Either hitting top or bottom obstacle
                (se.y + collisionMargin < this.topHeight || 
                 se.y + se.height - collisionMargin > this.bottomY)
            ) {
                endGame();
            }
        }
    }

    // Power-ups
    const powerUps = [];
    const powerUpInterval = 180; // Frames between power-ups
    let powerUpCount = 0;

    class PowerUp {
        constructor() {
            this.width = 40;
            this.height = 40;
            this.x = canvas.width;
            // Ensure power-ups appear in the playable area (below title bar)
            this.y = Math.random() * (canvas.height - titleBar.height - 200) + titleBar.height + 100;
            this.speed = 2;
            this.collected = false;
            this.type = Math.random() < 0.6 ? 'technical-win' : 'champion';
        }
        
        draw() {
            if (!this.collected) {
                if (this.type === 'technical-win') {
                    this.drawTechnicalWin();
                } else {
                    this.drawChampion();
                }
            }
        }
        
        drawTechnicalWin() {
            // Document/Certificate
            ctx.fillStyle = '#f1c40f'; // Golden background
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Paper effect
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
            
            // Trophy icon
            ctx.fillStyle = '#f39c12'; // Gold
            ctx.fillRect(this.x + 15, this.y + 8, 10, 15); // Trophy cup
            ctx.fillRect(this.x + 13, this.y + 23, 14, 2); // Trophy base
            ctx.fillRect(this.x + 17, this.y + 25, 6, 5); // Trophy stand
            
            // TW Text
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.fillText('TW', this.x + 12, this.y + 35);
        }
        
        drawChampion() {
            // Person/Champion
            ctx.fillStyle = '#27ae60'; // Green background
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Champion person
            ctx.fillStyle = '#f5d7b5'; // Skin tone
            ctx.fillRect(this.x + 15, this.y + 8, 10, 10); // Head
            
            // Business suit
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(this.x + 12, this.y + 18, 16, 15); // Body
            
            // Arms raised (victory)
            ctx.fillRect(this.x + 8, this.y + 12, 4, 10); // Left arm up
            ctx.fillRect(this.x + 28, this.y + 12, 4, 10); // Right arm up
            
            // CH Text
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText('CH', this.x + 12, this.y + 35);
        }
        
        update() {
            this.x -= this.speed;
            
            // More forgiving collision detection for power-ups
            const collisionMargin = -8; // Negative margin means larger hit area
            if (
                !this.collected &&
                se.x + se.width - collisionMargin > this.x &&
                se.x + collisionMargin < this.x + this.width &&
                se.y + se.height - collisionMargin > this.y &&
                se.y + collisionMargin < this.y + this.height
            ) {
                this.collected = true;
                this.applyEffect();
                
                // Visual feedback for collection
                this.showCollectionEffect();
            }
        }
        
        showCollectionEffect() {
            // Flash the score
            scoreDisplay.style.color = this.type === 'technical-win' ? '#f1c40f' : '#27ae60';
            setTimeout(() => {
                scoreDisplay.style.color = '#fff';
            }, 300);
        }
        
        applyEffect() {
            if (this.type === 'technical-win') {
                // Technical win: +5 points
                score += 5;
                scoreDisplay.textContent = score;
            } else if (this.type === 'champion') {
                // Champion: Clear obstacles ahead
                obstacles.forEach(obstacle => {
                    if (obstacle.x > se.x) {
                        obstacle.x = canvas.width + 100;
                    }
                });
            }
        }
    }

    // Game functions
    function startGame() {
        // Reset game state
        gameStarted = true;
        gameOver = false;
        score = 0;
        scoreDisplay.textContent = score;
        scoreDisplay.style.color = '#fff';
        
        // Hide UI screens
        gameStartScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        
        // Reset character and obstacles
        se.y = canvas.height / 2 - 20;
        se.velocity = 0;
        obstacles.length = 0;
        powerUps.length = 0;
        frameCount = 0;
        powerUpCount = 0;
        
        // Start the game loop
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Add first obstacle with longer delay for easier start
        setTimeout(() => {
            if (gameStarted) {
                obstacles.push(new Obstacle());
            }
        }, 2500); // Even longer initial delay
        
        gameLoop();
    }
    
    function endGame() {
        if (!gameOver) {
            gameOver = true;
            finalScoreDisplay.textContent = score;
            gameOverScreen.classList.remove('hidden');
            cancelAnimationFrame(animationId);
        }
    }
    
    function gameLoop() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky background with gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#3498db');  // Blue at top
        bgGradient.addColorStop(1, '#87CEEB');  // Lighter blue at bottom
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw clouds (decorative)
        drawClouds();
        
        // Draw title bar (always on top)
        titleBar.draw();
        
        // Update and draw Solutions Engineer
        se.update();
        se.draw();
        
        // Handle obstacles
        frameCount++;
        if (gameStarted && frameCount >= obstacleInterval) {
            obstacles.push(new Obstacle());
            frameCount = 0;
        }
        
        // Update and draw obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();
            
            // Remove obstacles that are off-screen
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
        
        // Handle power-ups
        powerUpCount++;
        if (gameStarted && powerUpCount >= powerUpInterval) {
            powerUps.push(new PowerUp());
            powerUpCount = 0;
        }
        
        // Update and draw power-ups
        for (let i = powerUps.length - 1; i >= 0; i--) {
            powerUps[i].update();
            powerUps[i].draw();
            
            // Remove power-ups that are off-screen or collected
            if (powerUps[i].x + powerUps[i].width < 0 || powerUps[i].collected) {
                powerUps.splice(i, 1);
            }
        }
        
        // Continue game loop
        if (!gameOver) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    // Cloud system for background decoration
    const clouds = [
        { x: 50, y: 100, width: 80, speed: 0.3 },
        { x: 200, y: 170, width: 60, speed: 0.2 },
        { x: 300, y: 250, width: 70, speed: 0.25 }
    ];
    
    function drawClouds() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        clouds.forEach(cloud => {
            // Draw a cloud (group of circles)
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.width / 4, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width / 4, cloud.y - cloud.width / 8, cloud.width / 3, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width / 2, cloud.y, cloud.width / 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Move the cloud
            cloud.x -= cloud.speed;
            
            // Reset cloud position if it goes off screen
            if (cloud.x + cloud.width < 0) {
                cloud.x = canvas.width + cloud.width;
                cloud.y = Math.random() * (canvas.height / 2) + titleBar.height;
            }
        });
    }
    
    // Initialize game display
    function initializeDisplay() {
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#3498db');  // Blue at top
        bgGradient.addColorStop(1, '#87CEEB');  // Lighter blue at bottom
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawClouds();
        titleBar.draw();
        se.draw();
    }
    
    // Initialize the game display
    initializeDisplay();
    
    // Event listeners
    function handleJump(e) {
        // Only respond to spacebar or clicks
        if (e.type === 'keydown' && e.code !== 'Space') return;
        e.preventDefault(); // Prevent spacebar scrolling
        
        if (!gameStarted && !gameOver) {
            // Initial game start
            startGame();
        } else if (gameStarted && !gameOver) {
            // Jump during gameplay
            se.jump();
        } else if (gameOver) {
            // Restart after game over
            startGame();
        }
    }
    
    document.addEventListener('keydown', handleJump);
    canvas.addEventListener('click', handleJump);
    restartButton.addEventListener('click', startGame);
});