/*
  TeslaHub - קובץ עיצוב משותף
  --------------------------------
  כל מיני-אפליקציה טוענת את הקובץ הזה ומיישמת את הצבעים ששמורים ב-Firebase
  תחת settings/theme. אם עדיין לא נשמרו הגדרות מותאמות אישית, נעשה שימוש
  בברירת המחדל (DEFAULT_THEME) שמוגדרת כאן.

  כדי שאפליקציה חדשה תמשוך עיצוב מכאן, מספיק:
    1. לכלול את Firebase SDK (app-compat + database-compat) ולאתחל עם firebaseConfig
    2. <script src="theme.js"></script>
    3. TeslaHubTheme.load();
*/
(function(){
  const DEFAULT_THEME = {
    bg: "#0A0C0B",
    bgPanel: "#141917",
    bgTile: "#1A211D",
    text: "#E8EDE9",
    textDim: "#8B978E",
    textOnAccent: "#05130B",
    accent: "#2FA76B",
    border: "#232925",
    danger: "#E5484D"
  };

  function hexToRgba(hex, alpha){
    let h = (hex || "#000000").replace("#","");
    if (h.length === 3) h = h.split("").map(c => c+c).join("");
    const num = parseInt(h, 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function applyTheme(theme){
    const t = Object.assign({}, DEFAULT_THEME, theme || {});
    const root = document.documentElement.style;
    root.setProperty("--bg", t.bg);
    root.setProperty("--bg-panel", t.bgPanel);
    root.setProperty("--bg-elevated", t.bgPanel);
    root.setProperty("--bg-tile", t.bgTile);
    root.setProperty("--text", t.text);
    root.setProperty("--text-dim", t.textDim);
    root.setProperty("--text-on-accent", t.textOnAccent);
    root.setProperty("--accent", t.accent);
    root.setProperty("--accent-soft", hexToRgba(t.accent, 0.14));
    root.setProperty("--border", t.border);
    root.setProperty("--danger", t.danger);
  }

  window.TeslaHubTheme = {
    DEFAULT_THEME: DEFAULT_THEME,
    applyTheme: applyTheme,
    // טוען מ-Firebase, ומאזין לשינויים חיים (למשל אם עורכים בהגדרות ממכשיר אחר)
    load: function(onReady){
      applyTheme(DEFAULT_THEME); // מיידי - כדי שלא יהיה הבזק לפני הטעינה
      try{
        firebase.database().ref("settings/theme").on("value", snap => {
          const custom = snap.val();
          applyTheme(custom);
          if (onReady) onReady(Object.assign({}, DEFAULT_THEME, custom || {}));
        }, () => { if (onReady) onReady(DEFAULT_THEME); });
      }catch(e){
        if (onReady) onReady(DEFAULT_THEME);
      }
    }
  };
})();
