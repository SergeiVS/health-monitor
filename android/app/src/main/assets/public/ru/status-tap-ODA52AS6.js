import {
  findClosestIonContent,
  scrollToTop
} from "./chunk-SWKRX3MJ.js";
import {
  readTask,
  writeTask
} from "./chunk-IQPROFXS.js";
import {
  componentOnReady
} from "./chunk-LS36PFGZ.js";
import "./chunk-2ZGYW7ZJ.js";
import {
  __async
} from "./chunk-4RK3B3NN.js";

// node_modules/@ionic/core/components/status-tap.js
var startStatusTap = () => {
  const win = window;
  win.addEventListener("statusTap", () => {
    readTask(() => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const el = document.elementFromPoint(width / 2, height / 2);
      if (!el) {
        return;
      }
      const contentEl = findClosestIonContent(el);
      if (contentEl) {
        new Promise((resolve) => componentOnReady(contentEl, resolve)).then(() => {
          writeTask(() => __async(null, null, function* () {
            contentEl.style.setProperty("--overflow", "hidden");
            yield scrollToTop(contentEl, 300);
            contentEl.style.removeProperty("--overflow");
          }));
        });
      }
    });
  });
};
export {
  startStatusTap
};
/*! Bundled license information:

@ionic/core/components/status-tap.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
/**i18n:47b311c64cc08524d625bf337677bb5214eca088ef5369afdb0896055efe48a1*/
//# sourceMappingURL=status-tap-ODA52AS6.js.map
