// Selectors for voice-to-text functionality
const startListeningButton = document.getElementById('start');
const stopListeningButton = document.getElementById('stop');
const copyTextButton = document.getElementById('copy');
const shareWhatsAppButton = document.getElementById('send-whatsapp');
const shareEmailButton = document.getElementById('send-email');
const outputBox = document.getElementById('output');

// Selectors for recording functionality
const recordButton = document.getElementById('record');
const stopRecordButton = document.getElementById('stop-record');
const sendRecordWhatsAppButton = document.getElementById('send-record-whatsapp');
const sendRecordEmailButton = document.getElementById('send-record-email');

// Additional UI elements
const micIcon = document.getElementById('mic-icon'); // Dynamic mic icon

// Speech Recognition setup
let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB'; // Adjust for UK and UAE accents

    let finalTranscript = ''; // To store the complete transcript

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        outputBox.innerHTML = `<p>${finalTranscript}</p><p style="color:gray;">${interimTranscript}</p>`;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start(); // Restart recognition for continuous mode
        }
    };
} else {
    alert('Speech Recognition not supported in this browser. Please use Google Chrome.');
}

// Start listening
startListeningButton.addEventListener('click', () => {
    if (recognition && !isListening) {
        recognition.start();
        isListening = true;
        updateMicState(true);
    }
});

// Stop listening
stopListeningButton.addEventListener('click', () => {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        updateMicState(false);
    }
});

// Copy text functionality
copyTextButton.addEventListener('click', () => {
    const text = outputBox.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    });
});

// Share text via WhatsApp
shareWhatsAppButton.addEventListener('click', () => {
    const text = outputBox.innerText;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
});

// Share text via Email
shareEmailButton.addEventListener('click', () => {
    const text = outputBox.innerText;
    const emailUrl = `mailto:?subject=Voice-to-Text&body=${encodeURIComponent(text)}`;
    window.open(emailUrl, '_blank');
});

// Audio recording setup
let mediaRecorder;
let audioChunks = [];

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
            audioChunks = []; // Clear audio chunks after recording

            sendRecordWhatsAppButton.addEventListener('click', () => {
                alert('Sharing recordings via WhatsApp requires server-side support.');
            });

            sendRecordEmailButton.addEventListener('click', () => {
                alert('Sharing recordings via Email requires server-side support.');
            });
        };
    });
} else {
    alert('Audio recording not supported in this browser.');
}

// Start recording
recordButton.addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.start();
        updateMicState(true);
        alert('Recording started!');
    }
});

// Stop recording
stopRecordButton.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        updateMicState(false);
        alert('Recording stopped!');
    }
});

// Helper functions
function updateMicState(isActive) {
    micIcon.style.color = isActive ? '#c084fc' : '#fff';
}
