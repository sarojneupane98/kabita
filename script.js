const messageText = "I wanted to find 100 photos to show you how much I love you, but I realized that my love can't be contained in a gallery. Every moment with you is my favorite memory. You are my heart, my soul, and my forever.";
const sigText = "With all my love,";
const myName = "Saroj Neupane"; // <--- CHANGE THIS TO YOUR NAME

let charIndex = 0;
let sigIndex = 0;
let nameIndex = 0;

// Typewriter Chain
function typeMessage() {
    if (charIndex < messageText.length) {
        document.getElementById("typewriter").innerHTML += messageText.charAt(charIndex);
        charIndex++;
        setTimeout(typeMessage, 40);
    } else {
        document.getElementById("sig-wrap").style.opacity = 1;
        typeSignature();
    }
}

function typeSignature() {
    if (sigIndex < sigText.length) {
        document.getElementById("sig-text").innerHTML += sigText.charAt(sigIndex);
        sigIndex++;
        setTimeout(typeSignature, 50);
    } else {
        typeName();
    }
}

function typeName() {
    if (nameIndex < myName.length) {
        document.getElementById("name-text").innerHTML += myName.charAt(nameIndex);
        nameIndex++;
        setTimeout(typeName, 80);
    } else {
        // Show buttons only after everything is typed
        const ask = document.getElementById("ask-section");
        ask.classList.remove("hidden");
    }
}

// Start
setTimeout(typeMessage, 1000);

// Flower Shower
function createFlower() {
    const flowers = ['🌹', '🌸', '🌺', '❤️'];
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = Math.random() * 100 + 'vw';
    document.getElementById('petal-container').appendChild(flower);
    
    const duration = Math.random() * 3000 + 2000;
    const fall = flower.animate([
        { transform: 'translateY(-5vh) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(110vh) rotate(360deg)', opacity: 0.5 }
    ], { duration: duration, easing: 'linear' });

    fall.onfinish = () => flower.remove();
}
let showerInterval = setInterval(createFlower, 500);

// Interaction Logic
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
let noScale = 1;
let yesScale = 1;

// Mobile-friendly "No" button
function handleNoInteraction(e) {
    e.preventDefault();
    noScale -= 0.15;
    yesScale += 0.15;
    
    if (noScale < 0.3) {
        noBtn.style.display = 'none';
    } else {
        noBtn.style.transform = `scale(${noScale})`;
        // Teleport
        const x = Math.random() * (window.innerWidth - 120);
        const y = Math.random() * (window.innerHeight - 60);
        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
        noBtn.style.zIndex = "9999";
    }
    yesBtn.style.transform = `scale(${yesScale})`;
}

// Attach both touch and click for safety
noBtn.addEventListener('touchstart', handleNoInteraction);
noBtn.addEventListener('click', handleNoInteraction);

// Yes Button
yesBtn.addEventListener('click', () => {
    document.getElementById('success-overlay').classList.remove('hidden');
    clearInterval(showerInterval);
    setInterval(createFlower, 50); // Massive explosion of flowers
});
