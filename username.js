// document.addEventListener('DOMContentLoaded', function () {
//     const username = localStorage.getItem('username');
//     console.log('Retrieved username:', username); // Debugging log
//     const usernameElement = document.getElementById('username');
//     if (usernameElement) {
//         usernameElement.textContent = `Welcome, ${username ? username : 'Guest'}`;
//     } else {
//         console.error('Username element not found');
//     }
// });


// the shit above doesnt matter for some reason ?

document.addEventListener('DOMContentLoaded', function () {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            // Manually run the username script after loading the navbar
            const email = localStorage.getItem('email');
            console.log('Email from localStorage:', email); // Debugging log
            const emailElement = document.getElementById('username');
            if (emailElement) {
                emailElement.textContent = `Welcome, ${email}`;
            } else {
                console.error('email element not found');
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
});