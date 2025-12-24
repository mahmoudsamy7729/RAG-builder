(function () {
  const cfg = window.CHATFUL_WIDGET || {};
  const botId = cfg.botId;

  if (!botId) {
    console.warn("[CHATful] botId is missing");
    return;
  }

  // prevent loading twice
  if (window.__CHATFUL_WIDGET_LOADED__) return;
  window.__CHATFUL_WIDGET_LOADED__ = true;

  const API_BASE = "http://localhost:8000"; // change to your API

  function styleLauncher(btn, settings) {
    btn.textContent = "Chat"; // or make it customizable later
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "14px";
    btn.style.color = "#fff";
    btn.style.background = settings.primary_color || "#3b82f6";
    btn.style.boxShadow = "0 10px 25px rgba(0,0,0,.2)";
  }

  function positionRoot(root, position) {
    const right = (position || "bottom-right") === "bottom-right";
    root.style.position = "fixed";
    root.style.bottom = "16px";
    root.style.zIndex = "2147483647";
    root.style[right ? "right" : "left"] = "16px";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.alignItems = right ? "flex-end" : "flex-start";
    root.style.gap = "10px";
  }

  async function fetchSettings() {
    const res = await fetch(`${API_BASE}/widget/config/${botId}`, {
      method: "GET",
      credentials: "omit",
    });
    if (!res.ok) throw new Error("Failed to load widget config");
    return res.json();
  }

  function createWidget(settings) {
    const root = document.createElement("div");
    root.id = "chatful-root";
    positionRoot(root, settings.position);

    const iframe = document.createElement("iframe");
    iframe.src = `${API_BASE}/widget-frame.html?botId=${encodeURIComponent(botId)}`;
    iframe.title = "CHATful Widget";
    iframe.style.width = "380px";
    iframe.style.height = "540px";
    iframe.style.border = "0";
    iframe.style.display = "none";
    iframe.style.borderRadius = "16px";
    iframe.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";
    iframe.allow = "clipboard-write";

    const btn = document.createElement("button");
    styleLauncher(btn, settings);

    let open = false;
    btn.onclick = () => {
      open = !open;
      iframe.style.display = open ? "block" : "none";
    };

    root.appendChild(btn);
    root.appendChild(iframe);
    document.body.appendChild(root);

    // send settings to iframe after it loads
    iframe.addEventListener("load", () => {
      iframe.contentWindow.postMessage(
        { type: "CHATFUL_INIT", botId, settings },
        "*"
      );
    });
  }

  fetchSettings()
    .then(createWidget)
    .catch((err) => console.warn("[CHATful]", err));
})();
