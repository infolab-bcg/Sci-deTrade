import { deleteUserTable, initUserTable, createUser, findUserByUsername, deleteUser } from '../database/userTable.mjs';

await deleteUserTable();
await initUserTable();
await createUser('test', 'test');
const user = await findUserByUsername('test');
console.log(user);
await deleteUser(user.id);
