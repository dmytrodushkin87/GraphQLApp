import '@babel/polyfill/noConflict';
import server from './server';

server.start({ port: process.env.PORT }, () => {
  console.log('The server is up');
});
