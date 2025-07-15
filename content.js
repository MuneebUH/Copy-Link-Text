if (!window.__copyLinkTextInitialized__) {
  window.__copyLinkTextInitialized__ = true;

  var lastLinkText = "";

  document.addEventListener("contextmenu", (e) => {
    const link = e.target.closest("a");
    if (link) {
      lastLinkText = link.innerText || link.textContent || link.href || '';
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "COPY_LAST_LINK_TEXT") {
      navigator.clipboard.writeText(lastLinkText).then(() => {
        const toast = document.createElement("div");
        toast.textContent = "✓ Link text copied!";
        Object.assign(toast.style, {
          position: "fixed",
          bottom: "30px",
          right: "30px",
          padding: "5px 10px",
          background: "#05ce37ff",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "16px",
          fontFamily: "sans-serif",
          zIndex: 99999,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          opacity: "0",
          transition: "opacity 0.3s ease"
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
          toast.style.opacity = "1";
        });
        setTimeout(() => {
          toast.style.opacity = "0";
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 1500);
      }).catch(err => {
        console.error("Failed to copy:", err);
      });
    }
  });

  // Notify background that script is ready
  chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_READY" });
}
