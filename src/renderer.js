window.onload = () => {
	document.addEventListener("wheel", async (e) => {
		const _x = e.deltaX;
		await window.apis.scrollWheel(-_x);
	});
};