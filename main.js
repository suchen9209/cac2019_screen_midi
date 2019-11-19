const {app, BrowserWindow} = require('electron')
const electron = require('electron')
const dialog = electron.dialog
const globalShortcut = electron.globalShortcut
const path = require('path')

var ipcMain = require('electron').ipcMain;

let controlWindow
let mainWindow

function createWindow(bounds){
  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    frame: false,  
    webPreferences: {
      nodeIntegration: true,
      zoomFactor:0.5
      // experimentalFeatures: true
    }
  })
  // const indexPath = path.join('file://',__dirname,'/index.html')
  // mainWindow.loadURL(indexPath)
  mainWindow.loadFile('index.html')
  // mainWindow.setIgnoreMouseEvents(true)
  mainWindow.setAlwaysOnTop(true)
  mainWindow.setFullScreen(true)
  mainWindow.webContents.openDevTools({mode:'detach'})
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  //console.log(mainWindow.webContents.getZoomLevel());
}

app.on('ready', ()=>{
  const modalPath2 = path.join('file://',__dirname,'/midi.html')
  controlWindow = new BrowserWindow({ width: 1680, height:1080,webPreferences: {nodeIntegration: true}}) 
  controlWindow.on('close',() =>{ win2 = null })
  controlWindow.webContents.openDevTools()
  controlWindow.loadURL(modalPath2)
  controlWindow.show()  
  controlWindow.on('closed',function(){
    controlWindow = null
    if(mainWindow!= null){
      mainWindow.close()
    }
  })
  
})

ipcMain.on('show_screen',(event,arg)=>{
  if(mainWindow != null){
    mainWindow.setBounds(arg)
  }else{
    createWindow(arg);
  }
})

ipcMain.on('sendmidi',(event,arg)=>{
  controlWindow.webContents.send('sendmidi',arg)
})
ipcMain.on('reload',(event,arg)=>{
  mainWindow.webContents.send('uiRefresh',arg)
})
// app.on('ready', function () {
//   globalShortcut.register('M',function(){
//     mainWindow.webContents.send('extraBarToggle',1);
//   });
//   globalShortcut.register('G',function(){
//     mainWindow.webContents.send('grenadeCountPanelToggle',1);
//   })
//   globalShortcut.register('Shift+R',function(){
//     mainWindow.webContents.send('uiRefresh',1);
//   })
//   ipc.on('freezetime',function(){
//     mainWindow.webContents.send('freezetimeExtraBarShow',1);
//   })
//   ipc.on('live',function(){
//     mainWindow.webContents.send('freezetimeExtraBarHide',1);
//   })
// })

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })
