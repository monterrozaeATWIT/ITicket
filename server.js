const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon')
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const articlesRouter = require('./routes/articles');

const app = express();
const PORT = 8081;
const secretKey = 's3cr3t$tr1ngF0rJWT!s3cur1ty'; // Your secret key for JWT

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cors());

// Icon 
app.use(favicon(__dirname + '/favicon.ico'));

// MongoDB Connection
//const mongoURI = 'mongodb://localhost:27017/ticketing_system';

const mongoURI = "mongodb+srv://monterrozae:GjA7g2dsxhV32FpB@cluster0.dzeifv9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// User Model
const User = require('./models/user');

// Ticket Model
const Ticket = require('./models/ticket');

// Articles Model
const Article = require('./models/article');

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Articles Route
app.use('/articles', articlesRouter);

// Serve index.html
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, 'name email'); // Fetching only name and email
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });

  app.post('/tickets/:id/comments', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const response = await Ticket.findById(ticketId);
        
        if (!response) {
            return res.status(404).send('Ticket not found');
        }

        response.comments.push(req.body.comment);
        await response.save();
        res.status(200).json(req.body.comment);
    } catch (error) {
        res.status(500).send('Server error');
    }
});  

app.get('/tickets/statistics', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        
        let responseTimes = [];
        let statusChangeTimes = [];

        tickets.forEach(ticket => {
            if (ticket.statusChanges && ticket.statusChanges.length > 0) {
                const responseTime = (ticket.statusChanges[0].timestamp - ticket.createdAt) / 1000 / 60; // in minutes
                responseTimes.push(responseTime);

                ticket.statusChanges.forEach((change, index) => {
                    if (index > 0) {
                        const statusChangeTime = (change.timestamp - ticket.statusChanges[index - 1].timestamp) / 1000 / 60; // in minutes
                        statusChangeTimes.push(statusChangeTime);
                    }
                });
            }
        });

        const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const averageStatusChangeTime = statusChangeTimes.reduce((a, b) => a + b, 0) / statusChangeTimes.length;

        res.json({ averageResponseTime, averageStatusChangeTime });
    } catch (error) {
        res.status(500).send('Server error');
    }
}); 


// User Signup Route
app.post('/users/signup', async (req, res) => {
    try {
        const { username, name, email, password, role } = req.body;
        const newUser = new User({ username, name, email, password: password, role });
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(400).send('Error creating user: ' + error.message);
    }
});

// User Login Route
app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');

        }
        const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, secretKey);
        res.status(200).json({ userId: user._id, role: user.role, email: user.email, token });
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
});

// Define the PUT route for updating the ticket status
app.put('/tickets/:id/status', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { status } = req.body;
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
        if (!updatedTicket) {
            return res.status(404).send('Ticket not found');
        }
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(400).send('Error updating ticket status: ' + error.message);
    }
});

// Route to get all tickets
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('user', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).send('Error fetching tickets: ' + error.message);
    }
});

// Route to get a single ticket by ID
app.get('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');
        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).send('Error fetching ticket: ' + error.message);
    }
});

// Route to create a new ticket
app.post('/tickets/submit-ticket', async (req, res) => {
    try {
        const { department, priority, subject, category, description, userEmail } = req.body;
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).send('User not found');
        }
        const newTicket = new Ticket({
            department,
            priority,
            subject,
            category,
            description,
            user: user._id,
            userEmail,
            status: 'Open' // Default status
        });
        await newTicket.save();
        res.status(201).send('Ticket submitted');
    } catch (error) {
        res.status(400).send('Error submitting ticket: ' + error.message);
    }
});

// Route to get user-specific tickets
app.get('/user/tickets', async (req, res) => {
    try {
        const { userEmail } = req.query;
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).send('User not found');
        }
        const tickets = await Ticket.find({ user: user._id }).populate('user', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).send('Error fetching tickets: ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
