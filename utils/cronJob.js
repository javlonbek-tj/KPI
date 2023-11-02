import { CronJob } from 'cron';
import pg from '../services/pg.js';

const job = new CronJob(
  '0 0 1 * *',
  async function () {
    const db = await pg();
    const employees = await db.users.findAll();
    const highestDateEntry = await db.date.findOne({
      order: [['id', 'DESC']],
    });
    const highestExistingDateId = highestDateEntry ? highestDateEntry.id : 0;
    let newDateId = highestExistingDateId + 1;
    for (let employee of employees) {
      await db.date.create({
        id: newDateId,
        date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ashgabat' }),
        userId: employee.id,
      });

      newDateId++;
    }
  },
  null,
  true,
  'Asia/Ashgabat',
);

export default job;
