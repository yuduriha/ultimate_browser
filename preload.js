const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('apis', {
	scrollWheel: async (x) => {
		ipcRenderer.invoke("scrollWheel", x);
	}
});
