import { CronJob } from 'cron';
import pg from '../services/pg.js';

const job = new CronJob(
  '0 0 1 * *',
  async function () {
    const db = await pg();
    const employees = await db.users.findAll();
    for (let employee of employees) {
      await db.date.create({
        date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ashgabat' }),
        userId: employee.id,
      });
    }
  },
  null,
  true,
  'Asia/Ashgabat',
);

export default job;
