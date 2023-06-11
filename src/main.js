const { app, BrowserWindow, ipcMain, screen } = require("electron");
const { dialog } = require("electron");
const path = require("path");


// Enable live reload for all the files inside your project directory
try {
require("electron-reload")(path.join(__dirname, "src"), {
  electron: require.resolve("electron"),
  hardResetMethod: "exit",
});} catch (_) {}

let mainWindow, audienceWindow, screenSize;

function createWindow() {
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: screenSize.width  - 200,
    height: screenSize.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("src/_control.html");
  mainWindow.webContents.openDevTools();



  audienceWindow = new BrowserWindow({
    x: screenSize.width - 200,
    y: 0,
    width: 200,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  audienceWindow.loadFile("src/_present.html");
  // audienceWindow.webContents.openDevTools();

  // to prevent audienceWindow from being closed directly...
  audienceWindow.on("close", function (e) {
    if (!app.isQuiting) {
      e.preventDefault(); // Prevents the window from closing
    }
  });

  // Closes the audienceWindow when the mainWindow is closed
  mainWindow.on("closed", function () {
    app.isQuiting = true;
    if (audienceWindow) audienceWindow.close();
  });
}

app.whenReady().then(() => {
  screenSize = screen.getPrimaryDisplay().size;
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Listen for the 'present-song' message and load the song into the iframe in the main window and audience window
ipcMain.on("present-song", (event, songSlide) => {
  mainWindow.webContents.executeJavaScript(`
    document.getElementById('songView').src = '../library/${songSlide}';
   `);
  audienceWindow.webContents.executeJavaScript(`
    document.getElementById('songView').src = '../library/${songSlide}';
   `);
});

ipcMain.handle("open-list-dialog", async (event) => {
  const result = await dialog.showOpenDialog({
    title: "Pick a playlist",
    properties: ["openFile"],
  });
  return result.filePaths[0];
});

ipcMain.handle("save-list-dialog", async (event) => {
  const result = await dialog.showSaveDialog({
    title: "Save playlist",
    // defaultPath: path.resolve('./playlists/'),
  });
  return result.filePath;
});
