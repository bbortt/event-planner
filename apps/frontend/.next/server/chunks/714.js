exports.id = 714;
exports.ids = [714];
exports.modules = {

/***/ 913:
/***/ ((module) => {

// Exports
module.exports = {
	"main": "layout_main__Rmzas"
};


/***/ }),

/***/ 481:
/***/ ((module) => {

// Exports
module.exports = {
	"userIcon": "user-information_userIcon__beVxI"
};


/***/ }),

/***/ 842:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rn": () => (/* binding */ wrapWithContext),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "hP": () => (/* binding */ getAccessToken)
/* harmony export */ });
/* harmony import */ var _auth0_nextjs_auth0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93);
/* harmony import */ var _auth0_nextjs_auth0__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_auth0_nextjs_auth0__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lib_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(105);


const audience =  true ? process.env.NEXT_PUBLIC_AUTH0_AUDIENCE : 0;
const auth0 = (0,_auth0_nextjs_auth0__WEBPACK_IMPORTED_MODULE_0__.initAuth0)({
    secret: process.env.SESSION_COOKIE_SECRET,
    issuerBaseURL: "https://event-planner-dev.eu.auth0.com",
    baseURL: "http://localhost:3000",
    clientID: "K2NedU1P40Kc7Y4BJ8GFjAzjFp0vzz48",
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    routes: {
        callback: "/api/auth/callback" || 0,
        postLogoutRedirect: "/" || 0
    },
    authorizationParams: {
        audience,
        response_type: "code",
        scope: "openid profile restapi:access"
    },
    session: {
        absoluteDuration: Number(process.env.SESSION_COOKIE_LIFETIME)
    }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (auth0);
const getAccessToken = async (req, res, audience, scopes)=>{
    const { accessToken  } = await auth0.getAccessToken(req, res, {
        authorizationParams: {
            audience
        },
        scopes
    });
    if (!accessToken) {
        throw Error("Unable to fetch access token!");
    }
    return accessToken;
};
const clientSideConfig = ()=>new Configuration({
        basePath: `${window.location.origin}/api/rest`
    });
const wrapWithContext = (constructor)=>{
    if (false) {} else {
        return constructor();
    }
};


/***/ }),

/***/ 80:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ layout)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(968);
var head_default = /*#__PURE__*/__webpack_require__.n(head_);
// EXTERNAL MODULE: external "react-bootstrap"
var external_react_bootstrap_ = __webpack_require__(358);
// EXTERNAL MODULE: ./lib/components/navbar/user-information.module.scss
var user_information_module = __webpack_require__(481);
var user_information_module_default = /*#__PURE__*/__webpack_require__.n(user_information_module);
;// CONCATENATED MODULE: ./lib/components/navbar/user-information.tsx



const UserIcon = ({ user  })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                children: user.name || user.nickname || "Profil"
            }),
            user.picture && /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Image, {
                rounded: true,
                src: user.picture,
                alt: "Profile picture",
                className: (user_information_module_default()).userIcon
            })
        ]
    });
};
const UserInformation = ({ user  })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.NavDropdown, {
        title: /*#__PURE__*/ jsx_runtime_.jsx(UserIcon, {
            user: user
        }),
        id: "collasible-nav-dropdown",
        children: /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.NavDropdown.Item, {
            href: "/api/auth/logout",
            children: "Uslogg\xe4"
        })
    });
};
/* harmony default export */ const user_information = (UserInformation);

;// CONCATENATED MODULE: ./lib/components/navbar/index.tsx



const Navigation = ({ user  })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Navbar, {
        collapseOnSelect: true,
        expand: "lg",
        bg: "dark",
        variant: "dark",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_react_bootstrap_.Container, {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Navbar.Brand, {
                    href: "/",
                    children: "Event-Planner"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Navbar.Toggle, {
                    "aria-controls": "responsive-navbar-nav"
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_react_bootstrap_.Navbar.Collapse, {
                    id: "responsive-navbar-nav",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Nav, {
                            className: "me-auto"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Nav, {
                            children: user ? /*#__PURE__*/ jsx_runtime_.jsx(user_information, {
                                user: user
                            }) : /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Nav.Link, {
                                href: "/api/auth/login",
                                children: "Ilogg\xe4"
                            })
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const navbar = (Navigation);

// EXTERNAL MODULE: ./lib/components/layout.module.scss
var layout_module = __webpack_require__(913);
var layout_module_default = /*#__PURE__*/__webpack_require__.n(layout_module);
;// CONCATENATED MODULE: ./lib/components/layout.tsx





const Contents = ({ user , children  })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(navbar, {
                user: user
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("main", {
                className: (layout_module_default()).main,
                children: /*#__PURE__*/ jsx_runtime_.jsx(external_react_bootstrap_.Container, {
                    className: "md-container",
                    children: children
                })
            })
        ]
    });
};
const Layout = ({ user , children  })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((head_default()), {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("title", {
                        children: "Event-Planner"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1, shrink-to-fit=no"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(Contents, {
                user: user,
                children: children
            })
        ]
    });
};
/* harmony default export */ const layout = (Layout);


/***/ }),

/***/ 105:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gg": () => (/* binding */ exists),
/* harmony export */   "IC": () => (/* binding */ RequiredError),
/* harmony export */   "QG": () => (/* binding */ JSONApiResponse),
/* harmony export */   "T2": () => (/* binding */ BaseAPI)
/* harmony export */ });
/* unused harmony exports BASE_PATH, Configuration, DefaultConfig, ResponseError, FetchError, COLLECTION_FORMATS, querystring, mapValues, canConsumeForm, VoidApiResponse, BlobApiResponse, TextApiResponse */
/* tslint:disable */ /* eslint-disable */ /**
 * Event-Planner
 * The Event-Planner REST API definition
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: timon.borter@gmx.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */ const BASE_PATH = "http://localhost:8080/api/rest".replace(/\/+$/, "");
class Configuration {
    constructor(configuration = {}){
        this.configuration = configuration;
    }
    set config(configuration) {
        this.configuration = configuration;
    }
    get basePath() {
        return this.configuration.basePath != null ? this.configuration.basePath : BASE_PATH;
    }
    get fetchApi() {
        return this.configuration.fetchApi;
    }
    get middleware() {
        return this.configuration.middleware || [];
    }
    get queryParamsStringify() {
        return this.configuration.queryParamsStringify || querystring;
    }
    get username() {
        return this.configuration.username;
    }
    get password() {
        return this.configuration.password;
    }
    get apiKey() {
        const apiKey = this.configuration.apiKey;
        if (apiKey) {
            return typeof apiKey === "function" ? apiKey : ()=>apiKey;
        }
        return undefined;
    }
    get accessToken() {
        const accessToken = this.configuration.accessToken;
        if (accessToken) {
            return typeof accessToken === "function" ? accessToken : async ()=>accessToken;
        }
        return undefined;
    }
    get headers() {
        return this.configuration.headers;
    }
    get credentials() {
        return this.configuration.credentials;
    }
}
const DefaultConfig = new Configuration();
/**
 * This is the base class for all generated API classes.
 */ class BaseAPI {
    constructor(configuration = DefaultConfig){
        this.configuration = configuration;
        this.fetchApi = async (url, init)=>{
            let fetchParams = {
                url,
                init
            };
            for (const middleware of this.middleware){
                if (middleware.pre) {
                    fetchParams = await middleware.pre({
                        fetch: this.fetchApi,
                        ...fetchParams
                    }) || fetchParams;
                }
            }
            let response = undefined;
            try {
                response = await (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init);
            } catch (e) {
                for (const middleware1 of this.middleware){
                    if (middleware1.onError) {
                        response = await middleware1.onError({
                            fetch: this.fetchApi,
                            url: fetchParams.url,
                            init: fetchParams.init,
                            error: e,
                            response: response ? response.clone() : undefined
                        }) || response;
                    }
                }
                if (response === undefined) {
                    if (e instanceof Error) {
                        throw new FetchError(e, "The request failed and the interceptors did not return an alternative response");
                    } else {
                        throw e;
                    }
                }
            }
            for (const middleware2 of this.middleware){
                if (middleware2.post) {
                    response = await middleware2.post({
                        fetch: this.fetchApi,
                        url: fetchParams.url,
                        init: fetchParams.init,
                        response: response.clone()
                    }) || response;
                }
            }
            return response;
        };
        this.middleware = configuration.middleware;
    }
    withMiddleware(...middlewares) {
        const next = this.clone();
        next.middleware = next.middleware.concat(...middlewares);
        return next;
    }
    withPreMiddleware(...preMiddlewares) {
        const middlewares = preMiddlewares.map((pre)=>({
                pre
            }));
        return this.withMiddleware(...middlewares);
    }
    withPostMiddleware(...postMiddlewares) {
        const middlewares = postMiddlewares.map((post)=>({
                post
            }));
        return this.withMiddleware(...middlewares);
    }
    async request(context, initOverrides) {
        const { url , init  } = await this.createFetchParams(context, initOverrides);
        const response = await this.fetchApi(url, init);
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        throw new ResponseError(response, "Response returned an error code");
    }
    async createFetchParams(context, initOverrides) {
        let url = this.configuration.basePath + context.path;
        if (context.query !== undefined && Object.keys(context.query).length !== 0) {
            // only add the querystring to the URL if there are query parameters.
            // this is done to avoid urls ending with a "?" character which buggy webservers
            // do not handle correctly sometimes.
            url += "?" + this.configuration.queryParamsStringify(context.query);
        }
        const headers = Object.assign({}, this.configuration.headers, context.headers);
        Object.keys(headers).forEach((key)=>headers[key] === undefined ? delete headers[key] : {});
        const initOverrideFn = typeof initOverrides === "function" ? initOverrides : async ()=>initOverrides;
        const initParams = {
            method: context.method,
            headers,
            body: context.body,
            credentials: this.configuration.credentials
        };
        const overridedInit = {
            ...initParams,
            ...await initOverrideFn({
                init: initParams,
                context
            })
        };
        const init = {
            ...overridedInit,
            body: isFormData(overridedInit.body) || overridedInit.body instanceof URLSearchParams || isBlob(overridedInit.body) ? overridedInit.body : JSON.stringify(overridedInit.body)
        };
        return {
            url,
            init
        };
    }
    /**
     * Create a shallow clone of `this` by constructing a new instance
     * and then shallow cloning data members.
     */ clone() {
        const constructor = this.constructor;
        const next = new constructor(this.configuration);
        next.middleware = this.middleware.slice();
        return next;
    }
}
function isBlob(value) {
    return typeof Blob !== "undefined" && value instanceof Blob;
}
function isFormData(value) {
    return typeof FormData !== "undefined" && value instanceof FormData;
}
class ResponseError extends Error {
    constructor(response, msg){
        super(msg);
        this.response = response;
        this.name = "ResponseError";
    }
}
class FetchError extends Error {
    constructor(cause, msg){
        super(msg);
        this.cause = cause;
        this.name = "FetchError";
    }
}
class RequiredError extends Error {
    constructor(field, msg){
        super(msg);
        this.field = field;
        this.name = "RequiredError";
    }
}
const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "	",
    pipes: "|"
};
function exists(json, key) {
    const value = json[key];
    return value !== null && value !== undefined;
}
function querystring(params, prefix = "") {
    return Object.keys(params).map((key)=>querystringSingleKey(key, params[key], prefix)).filter((part)=>part.length > 0).join("&");
}
function querystringSingleKey(key, value, keyPrefix = "") {
    const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
    if (value instanceof Array) {
        const multiValue = value.map((singleValue)=>encodeURIComponent(String(singleValue))).join(`&${encodeURIComponent(fullKey)}=`);
        return `${encodeURIComponent(fullKey)}=${multiValue}`;
    }
    if (value instanceof Set) {
        const valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
    }
    if (value instanceof Date) {
        return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString())}`;
    }
    if (value instanceof Object) {
        return querystring(value, fullKey);
    }
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
}
function mapValues(data, fn) {
    return Object.keys(data).reduce((acc, key)=>({
            ...acc,
            [key]: fn(data[key])
        }), {});
}
function canConsumeForm(consumes) {
    for (const consume of consumes){
        if ("multipart/form-data" === consume.contentType) {
            return true;
        }
    }
    return false;
}
class JSONApiResponse {
    constructor(raw, transformer = (jsonValue)=>jsonValue){
        this.raw = raw;
        this.transformer = transformer;
    }
    async value() {
        return this.transformer(await this.raw.json());
    }
}
class VoidApiResponse {
    constructor(raw){
        this.raw = raw;
    }
    async value() {
        return undefined;
    }
}
class BlobApiResponse {
    constructor(raw){
        this.raw = raw;
    }
    async value() {
        return await this.raw.blob();
    }
}
class TextApiResponse {
    constructor(raw){
        this.raw = raw;
    }
    async value() {
        return await this.raw.text();
    }
}


/***/ })

};
;