document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("wheel");
    const context = canvas.getContext("2d");
    const spinButton = document.getElementById("spinButton");
    const amountInput = document.getElementById("winAmount");

    let isSpinning = false;
    let startAngle = 0;

    // Create a wheel with each unique color segment rewarding a cash prize >> each has to have a cash prize so i wasnt sure if i should make the lowest value 1 or 0
    const segments = [
        { minDegree: 0, maxDegree: 18, color: "purple", prize: 5 },
        { minDegree: 18, maxDegree: 36, color: "green", prize: 0 },
        { minDegree: 36, maxDegree: 54, color: "blue", prize: 2 },
        { minDegree: 54, maxDegree: 72, color: "green", prize: 0 },
        { minDegree: 72, maxDegree: 90, color: "yellow", prize: 10 },
        { minDegree: 90, maxDegree: 108, color: "green", prize: 0 },
        { minDegree: 108, maxDegree: 126, color: "blue", prize: 2 },
        { minDegree: 126, maxDegree: 144, color: "green", prize: 0 },
        { minDegree: 144, maxDegree: 162, color: "purple", prize: 5 },
        { minDegree: 162, maxDegree: 180, color: "green", prize: 0 },
        { minDegree: 180, maxDegree: 198, color: "red", prize: 100 },
        { minDegree: 198, maxDegree: 216, color: "green", prize: 0 },
        { minDegree: 216, maxDegree: 234, color: "purple", prize: 5 },
        { minDegree: 234, maxDegree: 252, color: "green", prize: 0 },
        { minDegree: 252, maxDegree: 270, color: "blue", prize: 2 },
        { minDegree: 270, maxDegree: 288, color: "green", prize: 0 },
        { minDegree: 288, maxDegree: 306, color: "yellow", prize: 10 },
        { minDegree: 306, maxDegree: 324, color: "green", prize: 0 },
        { minDegree: 324, maxDegree: 342, color: "blue", prize: 2 },
        { minDegree: 342, maxDegree: 360, color: "green", prize: 0 },
    ];

    const segmentAngle = 18;
    let spinTime = 0;

    const tickSound = new Howl({
        src: ['Tick.wav'],
        volume: 0.5
    });

    const wheelImg = new Image();
    wheelImg.src = 'Wheel_Test.png';
    wheelImg.onload = function () {
        showWheel();
    };

    function showWheel() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2); 
        context.rotate(startAngle);
        const imageRotation = 9 * (Math.PI / 180); 
        context.rotate(imageRotation);
    
        context.drawImage(wheelImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        context.restore();

        context.save();
        context.translate(canvas.width / 2, canvas.height / 2); 
        context.rotate(startAngle);
    
        for (let i = 0; i < segments.length; i++) {
            const angle = i * segmentAngle * (Math.PI / 180);
            context.save();
            context.rotate(angle + (segmentAngle / 2) * (Math.PI / 180));
            context.translate(0, -canvas.width / 2.5);
    
            context.font = 'bold 20px Arial';
            context.fillStyle = '#FFFFFF';
            context.textAlign = 'center';
            context.fillText(segments[i].prize, 0, 0); 
            context.restore();
        }
    
        context.restore();
    
        context.beginPath();
        context.moveTo(canvas.width / 2, 10);
        context.lineTo(canvas.width / 2 - 15, 40);
        context.lineTo(canvas.width / 2 + 15, 40);
        context.closePath();
        context.fillStyle = "#FF0000";
        context.fill();
    }
    
    function spin() {
        if (isSpinning) return;

        const winAmount = parseInt(amountInput.value);
        if (isNaN(winAmount) || winAmount <= 0) {
            alert("Please enter a valid win amount.");
            return;
        }

        spinButton.disabled = true;
        amountInput.disabled = true;
        winLabel.innerHTML = "S P I N N I N G ...";
        winLabel.style.color = "white"; 

        isSpinning = true;
        spinTime = Math.random() * 3000 + 2000; 
        spinAnimation();
    }

    function spinAnimation() {
        if (spinTime > 0) {
            startAngle += (2 * Math.PI) / 30; 
            spinTime -= 1000 / 60; 

            tickSound.play(); 
            showWheel(); 
            requestAnimationFrame(spinAnimation);
        } else {
            isSpinning = false;
            const finalSpinAngle = (startAngle * (180 / Math.PI)) % 360; 
            calculateWin(finalSpinAngle);

            spinButton.disabled = false;
            amountInput.disabled = false;
        }
    }

    const winSound = new Howl({
        src: ['winSound.mp3'],
        volume: 0.5
    });

    function calculateWin(finalSpinAngle) {
        const adjustedAngle = (360 - finalSpinAngle) % 360; 
        const selectedSegment = segments.find(segment => {
            return adjustedAngle >= segment.minDegree && adjustedAngle < segment.maxDegree;});
        
        if (selectedSegment) {
            const winAmount = parseInt(amountInput.value);
            if (selectedSegment.prize <= 0){
                winLabel.innerHTML = `TRY AGAIN<br>You won: ${winAmount * selectedSegment.prize}`;
                winLabel.style.color = "#ff3333";
            }
            else{
                winSound.play();
                winLabel.innerHTML = `WINNER<br>You won: ${winAmount * selectedSegment.prize}`;
                winLabel.style.color = "#DBA514";
            }
           
        } else {
            alert("No segment found.");
        }
    }
    spinButton.addEventListener("click", spin);
});
