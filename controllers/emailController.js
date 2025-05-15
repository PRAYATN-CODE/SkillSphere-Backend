import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from '../utils/emailTemplates.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: '587',
    auth: {
        user: 'tavares.trantow@ethereal.email',
        pass: 'QrgqssnjezDcevGSZX'
    }
});

export const sendNotification = async (req, res, next) => {
    try {
        const { candidateEmail, subject, messageType, customMessage } = req.body;

        // Basic validation
        if (!candidateEmail || !subject || !messageType) {
            return res.status(400).json({ message: 'Missing required fields: candidateEmail, subject, or messageType' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(candidateEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const emailContent = getEmailTemplate(messageType, customMessage);

        if (!emailContent) {
            return res.status(400).json({ message: 'Invalid message type or template not found' });
        }

        const mailOptions = {
            from: `"Prayatn" <tavares.trantow@ethereal.email>`,
            to: candidateEmail,
            subject: subject,
            html: emailContent,
        };

        const result = await transporter.sendMail(mailOptions);

        console.log(result)

        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email Notification Error:', error);
        res.status(500).json({ message: 'Internal server error while sending email' });
    }
};
