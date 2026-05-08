let id = null;
self.onmessage = (e) => {
  if (e.data === "start") {
    if (id) clearInterval(id);
    id = setInterval(() => self.postMessage("tick"), 500);
  } else if (e.data === "stop") {
    clearInterval(id);
    id = null;
  }
};
