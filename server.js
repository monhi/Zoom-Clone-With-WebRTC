const   fs 			  	  = require('fs');
const   path 		  	  = require('path');
const   express   		= require('express')
const   https  	  		= require('https');
const { v4: uuidV4 } 	= require('uuid')
const {PeerServer}    = require('peer');

const   app       		= express()
const   PORT        	= 3000;

const options = {
    key:  fs.readFileSync(path.join(__dirname,'ssl','key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname,'ssl','cert.pem'), 'utf-8')
}

app.set('view engine', 'ejs')
app.use(express.static('public'))

const httpsServer 	= https.createServer(options,app);

const io = require('socket.io')(httpsServer)

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

const peerServer = PeerServer({
    port: 3001,
    ssl: {
      key:  fs.readFileSync(path.join(__dirname,'ssl','key.pem'), 'utf-8'),
      cert: fs.readFileSync(path.join(__dirname,'ssl','cert.pem'), 'utf-8')
    }
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {  
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    setTimeout(()=>{
      socket.broadcast.to(roomId).emit('user-connected',userId);
      socket.on('disconnect',()=>{
          console.log('user-disconnected is emitted');
          socket.broadcast.to(roomId).emit('user-disconnected',userId);
      });
    },500);
    })
})

httpsServer.listen(PORT,()=>{
	console.log(`Server listening to port ${PORT}`);
})
