This is one of the best projects that I find in Kyle's WebDevSimplified page.
It uses very simple techniques to handle a video conference by using WebRTC.
But it can be updated in a way that it can be better.

for that I apply following changes.
1. Makings server to be a HTTPS one instead of HTTP. In this way difference web browsers from different computers can work with it. 
2. Change broadcast command like **socket.broadcast.to**. it was **sockek.to(roomId).broadcast** before.
