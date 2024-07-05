document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            try {
                const response = await fetch('http://localhost:5000/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password, role })
                });

                if (response.status === 201) {
                    alert('User created successfully');
                    window.location.href = 'login.html';
                } else {
                    const errorText = await response.text();
                    alert('Error creating user: ' + errorText);
                }
            } catch (error) {
                alert('Error creating user: ' + error.message);
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageElement = document.getElementById('message');

            try {
                const response = await fetch('http://localhost:5000/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    messageElement.textContent = errorText;
                    return;
                }

                const data = await response.json();

                if (data.userId && data.role && data.email) {
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('email', data.email); // Store email in localStorage
                    if (data.role === 'IT') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'user_dashboard.html';
                    }
                } else {
                    messageElement.textContent = 'Invalid credentials. Please try again.';
                }
            } catch (error) {
                console.error('Error logging in:', error);
                messageElement.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    async function fetchTickets() {
        const response = await fetch('http://localhost:5000/tickets');
        if (!response.ok) {
            console.error('Network response was not ok');
            return;
        }
        const tickets = await response.json();
        const ticketTableBody = document.getElementById('ticketTableBody');
        ticketTableBody.innerHTML = '';

        tickets.forEach(ticket => {
            const user = ticket.user ? `${ticket.user.name} (${ticket.user.email})` : 'Unknown';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.subject}</td>
                <td>${ticket.department}</td>
                <td>${ticket.priority}</td>
                <td>${ticket.description}</td>
                <td>${new Date(ticket.createdAt).toLocaleString()}</td>
                <td>${user}</td>
                <td><button onclick="viewTicket('${ticket._id}')">View Details</button></td>
            `;
            ticketTableBody.appendChild(row);
        });
    }

    async function fetchUserTickets() {
        const email = localStorage.getItem('email');
        if (!email) {
            console.error('User email not found in localStorage');
            return;
        }

        const response = await fetch(`http://localhost:5000/user/tickets?userEmail=${email}`);
        if (!response.ok) {
            console.error('Network response was not ok');
            return;
        }
        const tickets = await response.json();
        const ticketTableBody = document.getElementById('ticketTableBody');
        ticketTableBody.innerHTML = '';

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.subject}</td>
                <td>${ticket.department}</td>
                <td>${ticket.priority}</td>
                <td>${ticket.description}</td>
                <td>${new Date(ticket.createdAt).toLocaleString()}</td>
                <td>${ticket.userEmail}</td>
                <td><button onclick="viewTicket('${ticket._id}')">View Details</button></td>
            `;
            ticketTableBody.appendChild(row);
        });
    }

    async function viewTicket(id) {
        const response = await fetch(`http://localhost:5000/tickets/${id}`);
        if (!response.ok) {
            console.error('Network response was not ok');
            return;
        }

        const ticket = await response.json();
        const ticketDetails = document.getElementById('ticketDetails');
        ticketDetails.innerHTML = `
            <h3>${ticket.subject}</h3>
            <p><strong>Department:</strong> ${ticket.department}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p><strong>Description:</strong> ${ticket.description}</p>
            <p><strong>Submitted At:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
            <p><strong>User:</strong> ${ticket.userEmail}</p>
        `;

        const modal = document.getElementById('ticketModal');
        modal.style.display = 'block';
    }

    const modal = document.getElementById('ticketModal');
    if (modal) {
        const closeModal = document.querySelector('.modal .close');
        closeModal.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    if (document.getElementById('ticketTableBody')) {
        const role = localStorage.getItem('role');
        if (role === 'IT') {
            fetchTickets();
        } else {
            fetchUserTickets();
        }
    }
});
