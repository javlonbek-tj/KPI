export default async function Relations(db) {
  await db.department.hasMany(db.users);
  await db.users.belongsTo(db.department);

  await db.position.hasMany(db.users);
  await db.users.belongsTo(db.position);

  await db.users.hasMany(db.expiredTasks, { onDelete: 'CASCADE', hooks: true });
  await db.expiredTasks.belongsTo(db.users);

  await db.users.hasMany(db.lateness, { onDelete: 'CASCADE', hooks: true });
  await db.lateness.belongsTo(db.users);

  await db.users.hasMany(db.date, { onDelete: 'CASCADE', hooks: true });
  await db.date.belongsTo(db.users);

  db.users.addHook('beforeDestroy', async user => {
    await db.expiredTasks.destroy({ where: { userId: user.id } });
    await db.lateness.destroy({ where: { userId: user.id } });
    await db.date.destroy({ where: { userId: user.id } });
  });
}
