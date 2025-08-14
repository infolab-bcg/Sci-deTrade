import { deleteUserTable, initUserTable, createUser, getUserByUsername, deleteUser } from '../database/userTable.mjs';

await deleteUserTable();
await initUserTable();
await createUser('test', 'test');
const user = await getUserByUsername('test');
console.log(user);
await deleteUser(user.username);
