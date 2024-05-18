import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { connect } from 'getstream';
import {StreamChat} from 'stream-chat';
import 'dotenv/config';

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
const app_id = process.env.APP_ID;

export async function signup(req, res) {
    try {
        const response = req.body;
        const { fullName, username, phoneNumber, password } = req.body;
        const userId = crypto.randomBytes(16).toString('hex');
        const serverClient = connect(api_key, api_secret, app_id);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });

    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

export async function login(req, res) {
    try {
        
        const { username, password } = req.body;
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });
        
        if (!users.length) return res.status(404).json({ message: "User not found" });
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if (success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        } else {
            res.status(500).json({ message: "Incorrect password" });
        }


    } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
    }
}