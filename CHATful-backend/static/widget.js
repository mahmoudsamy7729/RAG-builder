(function () {
  const scriptOrigin = (() => {
    try {
      return new URL(document.currentScript?.src || "").origin;
    } catch {
      return window.location.origin;
    }
  })();
  const cfg = window.CHATFUL_WIDGET || {};
  const botId = cfg.botId;

  if (!botId) {
    console.warn("[CHATful] botId is missing");
    return;
  }

  // prevent loading twice
  if (window.__CHATFUL_WIDGET_LOADED__) return;
  window.__CHATFUL_WIDGET_LOADED__ = true;

  const API_BASE = cfg.apiBase || scriptOrigin;

  function setRootPosition(root, position) {
    const right = (position || "bottom-right") === "bottom-right";
    root.style.position = "fixed";
    root.style.bottom = "32px";
    root.style.zIndex = "2147483647";
    root.style[right ? "right" : "left"] = "32px";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.alignItems = right ? "flex-end" : "flex-start";
    root.style.gap = "12px";
  }

  function styleLauncher(btn, primaryColor) {
    btn.setAttribute("aria-label", "Open chat");
    btn.style.width = "56px";
    btn.style.height = "56px";
    btn.style.borderRadius = "9999px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.background = primaryColor || "#3b82f6";
    btn.style.color = "#ffffff";
    btn.style.boxShadow = "0 10px 25px rgba(0,0,0,.18)";
    btn.style.transition = "transform 150ms ease";
    btn.onmouseenter = () => (btn.style.transform = "scale(1.05)");
    btn.onmouseleave = () => (btn.style.transform = "scale(1)");
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
      </svg>`;
  }

  async function fetchSettings() {
    const res = await fetch(`${API_BASE}/widget/config/${botId}`, {
      method: "GET",
      credentials: "omit",
    });
    if (!res.ok) throw new Error(`Failed to load widget config: ${res.status}`);
    return res.json();
  }

  function createWidget(settings) {
    const root = document.createElement("div");
    root.id = "chatful-root";
    setRootPosition(root, settings.position);

    // iframe (chat window)
    const iframe = document.createElement("iframe");
    iframe.src = `${API_BASE}/widget-frame.html`;
    iframe.title = "CHATful Widget";
    iframe.style.width = "320px";
    iframe.style.height = "420px";
    iframe.style.border = "1px solid rgba(226,232,240,1)";
    iframe.style.display = "none";
    iframe.style.borderRadius = "16px";
    iframe.style.overflow = "hidden";
    iframe.style.boxShadow = "0 20px 25px -5px rgba(15,23,42,.10), 0 8px 10px -6px rgba(15,23,42,.10)";
    iframe.allow = "clipboard-write";

    // launcher button
    const btn = document.createElement("button");
    styleLauncher(btn, settings.primary_color);

    let open = false;
    function toggle(openState) {
      open = openState ?? !open;
      iframe.style.display = open ? "block" : "none";
    }

    btn.onclick = () => toggle();

    root.appendChild(iframe);
    root.appendChild(btn);
    document.body.appendChild(root);

    // send settings to iframe after it loads
    iframe.addEventListener("load", () => {
      iframe.contentWindow.postMessage(
        { type: "CHATFUL_INIT", botId, settings, apiBase: API_BASE },
        "*"
      );
    });
  }

  fetchSettings()
    .then(createWidget)
    .catch((err) => console.warn("[CHATful]", err));
})();
