document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
        alert('Login successful');
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    if (response.status === 201) {
        alert('User created');
    } else {
        alert('Error creating user');
    }
	document.getElementById('ticketForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const department = document.getElementById('department').value;
    const priority = document.getElementById('priority').value;
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;

    const response = await fetch('http://localhost:5000/submit-ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ department, priority, subject, description })
    });

    if (response.status === 201) {
        alert('Ticket submitted successfully');
    } else {
        alert('Error submitting ticket');
    }
});


