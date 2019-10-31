const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var path = require('path');
var fs = require("fs");

const {Menu} = require('electron');

const template = [
  {
    label: 'Menu',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'toggledevtools'},
      {role: 'togglefullscreen'}
    ]
  }
];
let mainWindow;
let initPath;

app.on('ready', function() {
    const {session} = require('electron')
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({responseHeaders: `default-src 'https://github.com/johnendz'`})
    })
    initPath = path.join(app.getPath('userData'), "init.json");

    var data;
    try {
        data = JSON.parse(fs.readFileSync(initPath, 'utf8'));
    }
    catch(e) {}

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, 'icons/favicon.png'),
        backgroundColor: '#fff',
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadURL(`https://github.com/johnendz`,{
        extraHeaders: `Content-Security-Policy: default-src 'https://github.com/johnendz'`
    });
    mainWindow.webContents.executeJavaScript(""); // aqui você pode inserir uma variavel no browser, possibilitando o site reconhecer a varivel
    const ses = mainWindow.webContents.session;
    ses.webRequest.onHeadersReceived((details, callback) => {
        callback({responseHeaders: `default-src 'https://github.com/johnendz'`})
    })

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});
  
const URL = require('url').URL

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    if (parsedUrl.origin !== 'https://github.com/johnendz') {
      event.preventDefault()
    }
  })
})
const { shell } = require('electron')

app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', async (event, navigationUrl) => {
    event.preventDefault()
    await shell.openExternal(navigationUrl)
  })
})
