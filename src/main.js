const { app, BrowserWindow, ipcMain, screen } = require("electron");
const { dialog, session, Menu } = require("electron");
const path = require("path");

// Enable live reload for all the files inside your project directory
try {
  require("electron-reload")(path.join(__dirname, "src"), {
    electron: require.resolve("electron"),
    hardResetMethod: "exit",
  });
} catch (_) {}

let mainWindow, audienceWindow, screenSize;

function createWindow() {
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: Math.min(800, screenSize.width - 200),
    height: screenSize.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("src/_control.html");
  // mainWindow.webContents.openDevTools();

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
  // Prevent cache
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["Cache-Control"] =
      "no-cache, no-store, must-revalidate";
    details.requestHeaders["Pragma"] = "no-cache";
    details.requestHeaders["Expires"] = "0";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  setMenu();

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
  console.log(songSlide);
  mainWindow.webContents.executeJavaScript(`
  document.getElementById('songView').src = '${songSlide}';
  `);
  audienceWindow.webContents.executeJavaScript(`
  document.getElementById('songView').src = '${songSlide}';
   `);
});

ipcMain.handle("choose-library-path", async (event) => {
  const result = await dialog.showOpenDialog({
    title: "Pick a library folder",
    properties: ["openDirectory"],
  });
  return result.filePaths[0];
});

ipcMain.handle("open-list-dialog", async (event) => {
  const result = await dialog.showOpenDialog({
    title: "Pick a playlist",
    properties: ["openFile"],
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });
  return result.filePaths[0];
});

ipcMain.handle("save-list-dialog", async (event) => {
  const result = await dialog.showSaveDialog({
    title: "Save playlist",
    defaultPath: "playlist.txt",
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "All Files", extensions: ["*"] },
    ],
    // defaultPath: path.resolve('./playlists/'),
  });
  return result.filePath;
});

function setMenu() {
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click() {
            mainWindow.reload();
          },
        },
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Library",
      submenu: [
        {
          label: "Open library",
          click() {
            mainWindow.webContents.executeJavaScript(`chooseLibraryPath();`);
          },
        },
      ],
    },
    {
      label: "Playlist",
      submenu: [
        {
          label: "Next slide",
          accelerator: "B",
          click() {
            mainWindow.webContents.executeJavaScript(`playlistNext();`);
          },
        },
        {
          label: "Save as...",
          accelerator: "CmdOrCtrl+S",
          click() {
            mainWindow.webContents.executeJavaScript(`savePlaylistAs();`);
          },
        },
        {
          label: "Open...",
          accelerator: "CmdOrCtrl+O",
          click() {
            mainWindow.webContents.executeJavaScript(`openPlaylistFile();`);
          },
        },
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click() {
            mainWindow.webContents.executeJavaScript(`clearList();`);
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
