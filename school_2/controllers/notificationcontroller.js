import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';
import User from '../models/user.js';

dotenv.config();

const ONESIGNAL_APP_ID = "b43741c4-8b87-4f8a-a745-e1b4fb5055dc";
const ONESIGNAL_API_KEY = "os_v2_app_wq3udrelq5hyvj2f4g2pwucv3qinwc7aulueo5u2g3www7qrncrapdpyhsarywalff7dzahp6cy2auyuxb2ggfpkxryyuvs35vyuypq";

/**
 * Send Push Notification via OneSignal
**/

export const sendNotification = async ({ title, message, playerId })  => {

    try {

        // if (!playerId) {
        //     return res.status(400).json({ success: false, message: "Player ID is required" });
        // }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${ONESIGNAL_API_KEY}`
        };

        const body = {
            app_id: ONESIGNAL_APP_ID,
            // include_player_ids: [playerId], // Send notification to specific user
            headings: { "en": title },
            contents: { "en": message },
            included_segments: ["All"]
        };

        const response = await axios.post("https://onesignal.com/api/v1/notifications", body, { headers });

        // return res.status(200).json({ success: true, message: "Notification sent successfully", data: response.data });

    } catch (error) {
        console.error("Error sending notification:", error);
        // return res.status(500).json({ success: false, message: "Failed to send notification" });
    }
};





const checkDoseTimes = async () => {
    try {
        const users = await User.find();

        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

        for (const user of users) {
            let shouldTakeDose = false;

            if (user.breakfast && user.breakfast === currentTime) shouldTakeDose = true;
            if (user.lunch && user.lunch === currentTime) shouldTakeDose = true;
            if (user.dinner && user.dinner === currentTime) shouldTakeDose = true;

            if (shouldTakeDose) {
                await User.findByIdAndUpdate(user._id, { doseTaken: true });
                console.log(`Updated doseTaken for user ${user.name}`);
            }

            
            if (!user.doseTaken) {
                sendNotification({
                    title: 'Medication Reminder',
                    message: `Hey ${user.name}, don't forget to take your medicine!`,
                    playerId: user.playerId  
                });
            }
        }
    } catch (error) {
        console.error('Error checking dose times:', error);
    }
};

cron.schedule('* * * * *', checkDoseTimes);