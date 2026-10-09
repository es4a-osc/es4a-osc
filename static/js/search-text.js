/*
 * 为 Docsify 搜索补充表格、列表文本，并排除纯注释。
 * 保留原始 token 字段供正文渲染，不维护另一份内容或搜索索引。
 */
(function () {
	"use strict";

	if (!window.marked || !window.marked.lexer || !window.marked.parser) {
		return;
	}

	var lexer = window.marked.lexer;
	window.marked.lexer = function () {
		var tokens = lexer.apply(this, arguments);
		tokens.forEach(function (token) {
			if (token.type === "html" && !token.text.replace(/<!--[\s\S]*?-->/g, "").trim()) {
				token.text = "";
				return;
			}
			if (token.type !== "table" && token.type !== "list") {
				return;
			}
			var content = document.createElement("div");
			content.innerHTML = window.marked.parser([token]);
			var rows = content.querySelectorAll(token.type === "table" ? "tr" : "li");
			token.text = Array.prototype.map.call(rows, function (row) {
				if (token.type === "list") {
					return Array.prototype.map.call(row.childNodes, function (node) {
						return /^(UL|OL)$/.test(node.nodeName) ? "" : node.textContent;
					}).join("").trim();
				}
				return Array.prototype.map.call(row.children, function (cell) {
					return cell.textContent;
				}).join(" · ");
			}).join("\n");
		});
		return tokens;
	};
}());
