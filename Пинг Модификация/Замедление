(function() {
  const PING = 50;
  const originalSend = WebSocket.prototype.send;
  
  WebSocket.prototype.send = function(data) {
    setTimeout(() => originalSend.call(this, data), PING);
  };
  
  console.log('✓ +50ms ping added to WebSocket messages');
})();
