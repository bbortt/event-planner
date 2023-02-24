"use strict";
(() => {
var exports = {};
exports.id = 908;
exports.ids = [908];
exports.modules = {

/***/ 93:
/***/ ((module) => {

module.exports = require("@auth0/nextjs-auth0");

/***/ }),

/***/ 398:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lib_auth0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(361);

const login = async (req, res)=>{
    try {
        await lib_auth0__WEBPACK_IMPORTED_MODULE_0__/* ["default"].handleLogin */ .ZP.handleLogin(req, res);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).end(errorMessage);
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (login);


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [361], () => (__webpack_exec__(398)));
module.exports = __webpack_exports__;

})();