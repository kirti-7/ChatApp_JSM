import express from 'express';
import cors from 'cors';
import router from './routes/auth.js'
import dotenv from 'dotenv';
import twilio from 'twilio';


const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SERVICE_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = twilio(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Testing");
})

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;
    if (type === 'message.new') {
        members
            .filter(member => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if (!user.online) {
                    client.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    }).then(() => console.log("message sent"))
                        .catch(err => console.log(err));
                }
            });
        return res.status(200).send("Message sent successfully.");
    }
    return res.status(200).send("No new messages.");
})

app.use('/auth', router);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})