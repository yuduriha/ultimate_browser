const { app, BrowserView, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

const LIST = [
	"https://www.google.com/",
	"https://www.google.com/",
	"https://www.google.com/",
	"https://www.google.com/",
	"https://www.google.com/"
];

const TOP = 80; // Viewの鉛直表示位置
const WIDTH = 400; // Viewの幅
let WINDOW_SIZE = {w: 1200, h: 800}; // Windowの初期サイズ

let mainWindow;
let offsetX = 0;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: WINDOW_SIZE.w,
		height: WINDOW_SIZE.h,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	LIST.forEach((url, i) => {
		const view = new BrowserView();
		mainWindow.addBrowserView(view);
		view.setBounds({ x: WIDTH * i, y: TOP, width: WIDTH, height: WINDOW_SIZE.h });

		view.setAutoResize({ width: false, height: true, horizontal: false, vertical: true });
		view.webContents.loadURL(url);
	});

	mainWindow.loadFile('index.html');

	// devツールを別窓で開く
	//mainWindow.webContents.openDevTools({ mode: 'detach' });
};

/**
 * 描画htmlページ側のイベント購読
 */
const addEventRenderer = () => {
	ipcMain.handle('scrollWheel', async (_e, _arg) => {
		moveViews(_arg);
	});
};

/**
 * Viewを移動させる
 */
const moveViews = (delta) => {
	if(!delta) return;
	
	offsetX += +delta;
	const margin = 10;
	const size = mainWindow.getSize();
	const min = -WIDTH * LIST.length + size[0] - margin;

	if(offsetX > margin) {
		offsetX = margin;
	} else if(offsetX < min) {
		offsetX = min;
	}

	let views = mainWindow.getBrowserViews();
	views.forEach((view, i) => {
		view.setBounds({ x: offsetX + WIDTH * i, y: TOP, width: WIDTH, height: size[1] - TOP });
	});
};

app.whenReady().then(() => {
	app.commandLine.appendSwitch('touch-events', 'enabled');

	addEventRenderer();

	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
