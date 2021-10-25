const { app, BrowserWindow } = require('electron');

const path = require("path");
const isDev = require("electron-is-dev");
const url = require("url");

require("@electron/remote/main").initialize();

function createWindow() {
    const startUrl = isDev ? "http://localhost:3000" : process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      });

    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true,
        icon: path.join(__dirname, "./logo_merchbetter.png"),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });

    win.removeMenu();
    win.loadURL(startUrl);
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if( process.platform !== "darwin" ) app.quit();
});

app.on("activate", function() {
    if( BrowserWindow.getAllWindows().length === 0 ) createWindow();
})