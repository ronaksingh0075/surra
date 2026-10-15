/* ---------- boot */
applyTheme(S().settings);
watchSystemTheme();
render(html`<${App} />`, document.getElementById('app'));
initTTS();
initAI();
initSync();
initInstall();
initAccount();
initServiceWorker();
