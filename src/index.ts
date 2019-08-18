import 'reflect-metadata';
import {Server} from "./Server";

// createConnection().then(connection => {
//     console.log('DB connection success !');
// });

// const server = http.createServer(app);
// const gameServer = new Server({server});
//
// // register your room handlers
// gameServer.register('my_room', MyRoom);
//
//
// // register colyseus monitor AFTER registering your room handlers
// app.use("/colyseus", monitor(gameServer));
//
// gameServer.listen(port);
// console.log(`Listening on ws://localhost:${port}`);

const server = new Server();
server.start()
    .catch((er) => console.error(er));