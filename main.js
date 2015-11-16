var app = require("app");
var browserWindow = require("browser-window");

require("crash-reporter").start();

var mainWindow = null;

app.on("window-all-closed", function() {
  if(process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", function() {
  mainWindow = new browserWindow({});
  mainWindow.loadURL("file://" + __dirname + "/index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});
