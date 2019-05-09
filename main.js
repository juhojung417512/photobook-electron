const {app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');

let mainWindow;

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':

          application.quit();
          return true;
  }
};

var filepath = null;
var content = null;
function updateExistingFile(filePath, content){

  fs.writeFile(filepath, content, (err) => {
      if (err) {
          alert("An error ocurred updating the file" + err.message);
          console.log(err);
          return;
      }

      alert("The file has been succesfully saved");
  });
}

function showSaveDiaglog(content){
  dialog.showSaveDialog((fileName) => {
    if (fileName === undefined){
        console.log("You didn't save the file");
        return;
    }
    // fileName is a string that contains the path and filename created in the save file dialog.  
    fs.writeFile(fileName, content, (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message)
        }
                    
        alert("The file has been succesfully saved");
    });
  }); 
}

function createWindow () {
  mainWindow = new BrowserWindow({resizable:false, width: 1400, height: 800,icon : './icon.ico'})
  
  mainWindow.loadURL('http://118.218.219.253:3001');
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    console.log("will download",item,webContents)
    if(filepath !== null)
      item.setSavePath(filepath);
    // item.setSavePath(__dirname);
    item.on('updated', (event, state) => {
      console.log("item : ",item);
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        // showSaveDiaglog(item.getURL());
        filepath = item.getSavePath();
        console.log('filepath : ',filepath);
        const options = {
          type: 'info',
          buttons: ['확인'],
          title: '저장',
          message: '저장을 완료하였습니다.',
          // icon : './icon.png'
        };
        dialog.showMessageBox(options);
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

if(handleSquirrelEvent(app)){
  return ;
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
})

