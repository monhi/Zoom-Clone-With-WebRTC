const   fs 			  = require('fs');
const   path 		  = require('path');
const   express   = require('express')
const   https  	  = require('https');
const   app       = express()

const options = {
    key:  fs.readFileSync(path.join(__dirname,'ssl','key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname,'ssl','cert.pem'), 'utf-8')
}
const httpsServer 	= https.createServer(options,app);

//const server = require('http').Server(app)

const io = require('socket.io')(httpsServer)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    //socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      //socket.to(roomId).broadcast.emit('user-disconnected', userId)
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

httpsServer.listen(3000)
