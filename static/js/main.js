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
