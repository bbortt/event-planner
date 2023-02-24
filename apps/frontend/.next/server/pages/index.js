(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 591:
/***/ ((module) => {

// Exports
module.exports = {
	"masthead": "masthead_masthead__c2_67"
};


/***/ }),

/***/ 387:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages),
  "getServerSideProps": () => (/* binding */ getServerSideProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./lib/auth0.ts
var auth0 = __webpack_require__(842);
// EXTERNAL MODULE: ./lib/components/layout.tsx + 2 modules
var layout = __webpack_require__(80);
// EXTERNAL MODULE: external "react-bootstrap"
var external_react_bootstrap_ = __webpack_require__(358);
// EXTERNAL MODULE: ./lib/components/masthead.module.scss
var masthead_module = __webpack_require__(591);
var masthead_module_default = /*#__PURE__*/__webpack_require__.n(masthead_module);
;// CONCATENATED MODULE: ./lib/components/masthead.tsx



const Masthead = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx("header", {
        className: (masthead_module_default()).masthead,
        children: /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Container, {
            className: "md-container",
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_react_bootstrap_.Row, {
                className: "align-items-center justify-content-center text-center",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_react_bootstrap_.Col, {
                        lg: 8,
                        className: "align-self-end",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("h1", {
                                className: "font-weight-bold",
                                children: "Mit mir m\xe4n\xe4tschisch diner Events locker!"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("hr", {
                                className: "divider"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_react_bootstrap_.Col, {
                        lg: 8,
                        className: "align-self-baseline",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: "mb-5",
                                children: "Es isch im Fall gar ned eso schwierig: Efach mal ilogg\xe4 und alueg\xe4. Findsch di de scho ds recht!"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Button, {
                                href: "/api/auth/login",
                                children: "Ilogg\xe4"
                            })
                        ]
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const masthead = (Masthead);

;// CONCATENATED MODULE: ./pages/index.tsx




const Home = ({ user  })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(layout/* default */.Z, {
        user: user,
        children: /*#__PURE__*/ jsx_runtime_.jsx(masthead, {})
    });
};
const getServerSideProps = async ({ req , res  })=>{
    const session = await auth0/* default.getSession */.ZP.getSession(req, res);
    if (session && session.user) {
        return {
            redirect: {
                destination: "/projects",
                permanent: false
            }
        };
    }
    return {
        props: {
            user: session ? session.user : null
        }
    };
};
/* harmony default export */ const pages = (Home);


/***/ }),

/***/ 93:
/***/ ((module) => {

"use strict";
module.exports = require("@auth0/nextjs-auth0");

/***/ }),

/***/ 968:
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ 358:
/***/ ((module) => {

"use strict";
module.exports = require("react-bootstrap");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [714], () => (__webpack_exec__(387)));
module.exports = __webpack_exports__;

})();