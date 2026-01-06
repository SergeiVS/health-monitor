// node_modules/@ionic/core/components/dir.js
var isRTL = (hostEl) => {
  if (hostEl) {
    if (hostEl.dir !== "") {
      return hostEl.dir.toLowerCase() === "rtl";
    }
  }
  return (document === null || document === void 0 ? void 0 : document.dir.toLowerCase()) === "rtl";
};

export {
  isRTL
};
/*! Bundled license information:

@ionic/core/components/dir.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
/**i18n:47b311c64cc08524d625bf337677bb5214eca088ef5369afdb0896055efe48a1*/
//# sourceMappingURL=chunk-GSP366QS.js.map
