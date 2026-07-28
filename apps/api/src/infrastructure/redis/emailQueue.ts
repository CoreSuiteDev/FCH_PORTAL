import { Queue, Worker } from "bullmq";
import { redisConnection } from "./connection.js";
import sendMail from "../email/email.js";

export const emailQueue = new Queue('emailQueue', { connection: redisConnection as any });

const emailWorker = new Worker("emailQueue", async (job) => {
    const { to, subject, text } = job.data;

    console.log(`[Queue] Processing job ${job.id} for ${to}`);

    await sendMail(to, subject, text);
}, {
    connection: redisConnection as any,
    limiter: {
        max: 5,
        duration: 1000,
    }
});

emailWorker.on('failed', (job, err) => {
    console.error(`[Queue] Job ${job?.id} failed with error: ${err.message}`);
});