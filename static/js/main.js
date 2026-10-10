/* 着陆页返回顶部按钮：按实际滚动范围更新进度，尊重减少动态效果的系统设置。 */
(() => {
	const button = document.querySelector('.back-top');
	const ring = button?.querySelector('.progress-ring');
	if (!button || !ring) return;

	let scheduled = false;
	const update = () => {
		const range = document.documentElement.scrollHeight - window.innerHeight;
		const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
		button.hidden = window.scrollY < 300;
		ring.style.strokeDashoffset = String(100 * (1 - progress));
		scheduled = false;
	};
	const scheduleUpdate = () => {
		if (scheduled) return;
		scheduled = true;
		window.requestAnimationFrame(update);
	};

	button.addEventListener('click', () => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
	});
	window.addEventListener('scroll', scheduleUpdate, { passive: true });
	window.addEventListener('resize', scheduleUpdate);
	window.addEventListener('load', scheduleUpdate);
	// 问答展开或收起会改变页面高度，即使滚动位置不变也须更新进度。
	document.querySelectorAll('.faq details').forEach(details => {
		details.addEventListener('toggle', scheduleUpdate);
	});
	update();
})();

/* 截图查看：保留原图链接作为无脚本兜底，使用原生模态框管理键盘焦点。 */
(() => {
	const trigger = document.querySelector('.preview-link');
	const dialog = document.querySelector('.image-viewer');
	const image = dialog?.querySelector('.image-viewer-image');
	const viewport = dialog?.querySelector('.image-viewer-content');
	const sizeButton = dialog?.querySelector('.image-viewer-size');
	const sizeLabel = dialog?.querySelector('.image-viewer-size-label');
	const closeButton = dialog?.querySelector('.image-viewer-close');
	const status = dialog?.querySelector('.image-viewer-status');
	if (!trigger || !dialog || !image || !viewport || !sizeButton || !sizeLabel || !closeButton || !status || typeof dialog.showModal !== 'function') return;

	let savedScroll = { x: 0, y: 0 };
	const setOriginalSize = original => {
		dialog.classList.toggle('is-original', original);
		sizeLabel.textContent = original ? '适应屏幕' : '原始尺寸';
		sizeButton.setAttribute('aria-label', original ? '切换为适应屏幕' : '切换为原始尺寸');
		viewport.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	};
	const finishLoading = () => {
		if (!dialog.open) return;
		const loaded = image.naturalWidth > 0;
		image.hidden = !loaded;
		sizeButton.disabled = !loaded;
		status.hidden = loaded;
		if (!loaded) status.textContent = '截图加载失败，请关闭后重试。';
	};
	image.addEventListener('load', finishLoading);
	image.addEventListener('error', finishLoading);
	trigger.addEventListener('click', event => {
		// 保留 Ctrl/Command 点击等浏览器原生的新标签页操作。
		if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
		event.preventDefault();
		if (dialog.open) return;
		savedScroll = { x: window.scrollX, y: window.scrollY };
		setOriginalSize(false);
		image.hidden = true;
		sizeButton.disabled = true;
		status.hidden = false;
		status.textContent = '正在加载截图…';
		dialog.showModal();
		document.documentElement.classList.add('image-viewer-open');
		image.src = trigger.href;
		if (image.complete) finishLoading();
	});
	sizeButton.addEventListener('click', () => setOriginalSize(!dialog.classList.contains('is-original')));
	image.addEventListener('click', () => setOriginalSize(!dialog.classList.contains('is-original')));
	closeButton.addEventListener('click', () => dialog.close());
	dialog.addEventListener('close', () => {
		document.documentElement.classList.remove('image-viewer-open');
		trigger.focus({ preventScroll: true });
		window.scrollTo({ left: savedScroll.x, top: savedScroll.y, behavior: 'instant' });
	});
})();
