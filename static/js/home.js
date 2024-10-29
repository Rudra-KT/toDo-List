// Typed.js Effect
var typed = new Typed('.auto-type', {
    strings: ['Welcome to my ToDo App'],
    typeSpeed: 70,
    backSpeed: 100,
    loop: true
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to fade out and remove flash messages
    function removeFlashMessages() {
        const flashMessages = document.querySelectorAll('.alert');
        flashMessages.forEach(function(message) {
            // Start fading out after 3 seconds
            setTimeout(function() {
                message.style.transition = 'opacity 1s';
                message.style.opacity = '0';

                // Remove the element after fade out
                setTimeout(function() {
                    message.remove();
                }, 1000);
            }, 3000);
        });
    }

    // Call the function when the page loads
    removeFlashMessages();
});

// Array of memes
const memes = [
    { image: '/static/images/daenerys.jpeg', heading: 'THAT SPECIAL moment', text: 'When you find the perfect avocado 🥑 at the supermarket' },
    { image: '/static/images/anime.jpg', heading: '🚀CHASE YOUR DREAMS LIKE YOUR FAVORITE ANIME HERO 🚀', text: 'The journey may be tough, but it\'s your determination that makes the difference' },
    { image: '/static/images/nike.jpg', heading: 'JUST DO IT 👟', text: 'Don\'t wait for the perfect moment, take the moment and make it perfect' },
    { image: '/static/images/gintama.jpg', heading: 'Life is like a soap bubble 🫧', text: 'It rides on the wind, flying here and there ... And before you realize it, pop! It\'s gone' },
    { image: '/static/images/banana.jpg', heading: 'My mother always used to say', text: 'The older you get, the better you get, unless you\'re a banana' },
    { image: '/static/images/cat.jpg', heading: 'Cats are smarter than dogs', text: 'You can\'t get eight cats to pull a sled through snow' }
];

// Display a random meme on load
window.addEventListener('load', () => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    const randomMeme = memes[randomIndex];

    document.querySelector('.randomMotivation > img').src = randomMeme.image;
    document.getElementById('memeHeading').textContent = randomMeme.heading;
    document.getElementById('memeText').textContent = randomMeme.text;
});

// Theme Toggle Function
document.querySelector('.change-theme').addEventListener('click', () => {
    document.body.classList.toggle('welcomePageDark');
    document.body.classList.toggle('welcomePageLight');
});

// Navigate to the ToDo App
function startApp() {
    window.location.href = '{{ url_for("todo") }}';
}