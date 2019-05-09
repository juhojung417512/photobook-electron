// var createInstaller = require('electron-installer-squirrel-windows');

// createInstaller({
//   name : 'Photobook',
//   path: './dist/Photobook-win32-x64',
//   out: './dist/installer',
//   authors: 'fingeredu',
//   exe: 'Photobook.exe',
//   appDirectory: './dist/Photobook-win32-x64',
//   overwrite: true,
//   setup_icon: './icon.ico',
//   loading_gif : './install-spinner.gif'
// }, function done (e) {
//   console.log('Build success !!');
// });

var electronInstaller = require('electron-winstaller');

var settings = {
  appDirectory: './dist/Photobook-win32-x64',
  outputDirectory: './dist/installer',
  authors: 'photobook',
  exe: 'photobook.exe',
  setupIcon : './icon.ico',
  loadingGif : './install-spinner.gif'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
  console.log("The installers of your application were succesfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});