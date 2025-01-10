const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({origin: '*', }));
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, 
    auth: {
        user: email,
        pass: password
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
  res.send("Hello from Express!")
})

// POST endpoint to handle form submission
app.post('/api/submit', (req, res) => {
    try {
        const { firstName, lastName, phone, email, message } = req.body;

  if (!firstName && !phone && !email && !message) {
    return res.status(400).json({ error: 'Please fill the form and then submmit' });
  }

  // Simple validation
  if (!firstName || !phone || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Prepare email content
  const mailOptions = {
    from: 'revazi.kukhianidze@gmail.com',
    to: 'revazkukhianidze@gmail.com', // Recipient's email
    subject: 'New Contact Form Submission',
    text: `
      You have received a new message from your contact form:

      First Name: ${firstName}
      Last Name: ${lastName}
      Phone: ${phone}
      Email: ${email}
      Message: ${message}
  
    `,
  };
  

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('error', error);
      return res.status(500).json({ error: 'Failed to send email.' });
    }
    res.status(200).json({ message: 'Email sent successfully!', });
    });

    }catch(err){
      console.log('catch error', err);
        res.status(500).send('Internal Server Error')
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

