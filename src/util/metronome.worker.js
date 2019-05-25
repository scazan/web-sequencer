let timerID=null;
let interval=100;

self.addEventListener('message', (e) => {
  if (e.data === "start") {
    timerID = setInterval(() => postMessage("tick"), interval);
  }
  else if (e.data.interval) {
    // setting interval
    interval = e.data.interval;

    if (timerID) {
      clearInterval(timerID);
      timerID = setInterval(() => postMessage("tick"), interval);
    }
  }
  else if (e.data === "stop") {
    // stopping
    clearInterval(timerID);
    timerID = null;
  }
});
