export default async function Relations(db) {
  await db.department.hasMany(db.users);
  await db.users.belongsTo(db.department);

  await db.position.hasMany(db.users);
  await db.users.belongsTo(db.position);

  await db.users.hasMany(db.expiredTasks);
  await db.expiredTasks.belongsTo(db.users);

  await db.users.hasMany(db.lateness);
  await db.lateness.belongsTo(db.users);

  await db.users.hasMany(db.date);
  await db.date.belongsTo(db.users);
}
