let recognition;
let listening = false;

// Speech recognition setup
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB'; // UK English. Change to 'en-AE' for UAE.

    recognition.onstart = () => console.log("Voice recognition started.");
    recognition.onend = () => console.log("Voice recognition ended.");
    recognition.onerror = (event) => console.error("Error: ", event.error);

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        document.getElementById('output').innerText = transcript;
    };
} else {
    alert("Your browser does not support speech recognition. Please try Chrome.");
}

// Event listeners for buttons
document.getElementById('start-btn').onclick = () => {
    if (!listening) {
        recognition.start();
        listening = true;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
    }
};

document.getElementById('stop-btn').onclick = () => {
    if (listening) {
        recognition.stop();
        listening = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
    }
};

document.getElementById('copy-btn').onclick = () => {
    const text = document.getElementById('output').innerText;
    navigator.clipboard.writeText(text)
        .then(() => alert("Text copied to clipboard!"))
        .catch(err => console.error("Error copying text: ", err));
};

document.getElementById('whatsapp-btn').onclick = () => {
    const text = encodeURIComponent(document.getElementById('output').innerText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};

document.getElementById('email-btn').onclick = () => {
    const text = encodeURIComponent(document.getElementById('output').innerText);
    window.open(`mailto:?subject=Shared Text&body=${text}`, '_blank');
};

// Virtual keyboard setup
function showKeyboard() {
    const keyboardContainer = document.getElementById('virtual-keyboard');
    keyboardContainer.style.display = 'flex';
    keyboardContainer.innerHTML = '';

    const keys = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    keys.forEach(key => {
        const keyButton = document.createElement('button');
        keyButton.innerText = key;
        keyButton.onclick = () => insertKey(key);
        keyboardContainer.appendChild(keyButton);
    });

    // Special keys
    ['Backspace', 'Space', 'Enter'].forEach(key => {
        const specialKey = document.createElement('button');
        specialKey.innerText = key;
        specialKey.classList.add('special-key');
        specialKey.onclick = () => handleSpecialKey(key);
        keyboardContainer.appendChild(specialKey);
    });
}

function insertKey(key) {
    const output = document.getElementById('output');
    output.innerText += key;
}

function handleSpecialKey(key) {
    const output = document.getElementById('output');
    if (key === 'Backspace') {
        output.innerText = output.innerText.slice(0, -1);
    } else if (key === 'Space') {
        output.innerText += ' ';
    } else if (key === 'Enter') {
        output.innerText += '\n';
    }
}
