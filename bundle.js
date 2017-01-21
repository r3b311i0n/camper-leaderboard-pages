/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId])
        /******/            return installedModules[moduleId].exports;
        /******/
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            exports: {},
            /******/            id: moduleId,
            /******/            loaded: false
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.loaded = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "/dist/";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(0);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ function (module, exports, __webpack_require__) {

        __webpack_require__(1);
        module.exports = __webpack_require__(2);


        /***/
    },
    /* 1 */
    /***/ function (module, exports) {

        (function (self) {
            'use strict';

            if (self.fetch) {
                return
            }

            var support = {
                searchParams: 'URLSearchParams' in self,
                iterable: 'Symbol' in self && 'iterator' in Symbol,
                blob: 'FileReader' in self && 'Blob' in self && (function () {
                    try {
                        new Blob()
                        return true
                    } catch (e) {
                        return false
                    }
                })(),
                formData: 'FormData' in self,
                arrayBuffer: 'ArrayBuffer' in self
            }

            if (support.arrayBuffer) {
                var viewClasses = [
                    '[object Int8Array]',
                    '[object Uint8Array]',
                    '[object Uint8ClampedArray]',
                    '[object Int16Array]',
                    '[object Uint16Array]',
                    '[object Int32Array]',
                    '[object Uint32Array]',
                    '[object Float32Array]',
                    '[object Float64Array]'
                ]

                var isDataView = function (obj) {
                    return obj && DataView.prototype.isPrototypeOf(obj)
                }

                var isArrayBufferView = ArrayBuffer.isView || function (obj) {
                        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
                    }
            }

            function normalizeName(name) {
                if (typeof name !== 'string') {
                    name = String(name)
                }
                if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
                    throw new TypeError('Invalid character in header field name')
                }
                return name.toLowerCase()
            }

            function normalizeValue(value) {
                if (typeof value !== 'string') {
                    value = String(value)
                }
                return value
            }

            // Build a destructive iterator for the value list
            function iteratorFor(items) {
                var iterator = {
                    next: function () {
                        var value = items.shift()
                        return {done: value === undefined, value: value}
                    }
                }

                if (support.iterable) {
                    iterator[Symbol.iterator] = function () {
                        return iterator
                    }
                }

                return iterator
            }

            function Headers(headers) {
                this.map = {}

                if (headers instanceof Headers) {
                    headers.forEach(function (value, name) {
                        this.append(name, value)
                    }, this)

                } else if (headers) {
                    Object.getOwnPropertyNames(headers).forEach(function (name) {
                        this.append(name, headers[name])
                    }, this)
                }
            }

            Headers.prototype.append = function (name, value) {
                name = normalizeName(name)
                value = normalizeValue(value)
                var oldValue = this.map[name]
                this.map[name] = oldValue ? oldValue + ',' + value : value
            }

            Headers.prototype['delete'] = function (name) {
                delete this.map[normalizeName(name)]
            }

            Headers.prototype.get = function (name) {
                name = normalizeName(name)
                return this.has(name) ? this.map[name] : null
            }

            Headers.prototype.has = function (name) {
                return this.map.hasOwnProperty(normalizeName(name))
            }

            Headers.prototype.set = function (name, value) {
                this.map[normalizeName(name)] = normalizeValue(value)
            }

            Headers.prototype.forEach = function (callback, thisArg) {
                for (var name in this.map) {
                    if (this.map.hasOwnProperty(name)) {
                        callback.call(thisArg, this.map[name], name, this)
                    }
                }
            }

            Headers.prototype.keys = function () {
                var items = []
                this.forEach(function (value, name) {
                    items.push(name)
                })
                return iteratorFor(items)
            }

            Headers.prototype.values = function () {
                var items = []
                this.forEach(function (value) {
                    items.push(value)
                })
                return iteratorFor(items)
            }

            Headers.prototype.entries = function () {
                var items = []
                this.forEach(function (value, name) {
                    items.push([name, value])
                })
                return iteratorFor(items)
            }

            if (support.iterable) {
                Headers.prototype[Symbol.iterator] = Headers.prototype.entries
            }

            function consumed(body) {
                if (body.bodyUsed) {
                    return Promise.reject(new TypeError('Already read'))
                }
                body.bodyUsed = true
            }

            function fileReaderReady(reader) {
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result)
                    }
                    reader.onerror = function () {
                        reject(reader.error)
                    }
                })
            }

            function readBlobAsArrayBuffer(blob) {
                var reader = new FileReader()
                var promise = fileReaderReady(reader)
                reader.readAsArrayBuffer(blob)
                return promise
            }

            function readBlobAsText(blob) {
                var reader = new FileReader()
                var promise = fileReaderReady(reader)
                reader.readAsText(blob)
                return promise
            }

            function readArrayBufferAsText(buf) {
                var view = new Uint8Array(buf)
                var chars = new Array(view.length)

                for (var i = 0; i < view.length; i++) {
                    chars[i] = String.fromCharCode(view[i])
                }
                return chars.join('')
            }

            function bufferClone(buf) {
                if (buf.slice) {
                    return buf.slice(0)
                } else {
                    var view = new Uint8Array(buf.byteLength)
                    view.set(new Uint8Array(buf))
                    return view.buffer
                }
            }

            function Body() {
                this.bodyUsed = false

                this._initBody = function (body) {
                    this._bodyInit = body
                    if (!body) {
                        this._bodyText = ''
                    } else if (typeof body === 'string') {
                        this._bodyText = body
                    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                        this._bodyBlob = body
                    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                        this._bodyFormData = body
                    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                        this._bodyText = body.toString()
                    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                        this._bodyArrayBuffer = bufferClone(body.buffer)
                        // IE 10-11 can't handle a DataView body.
                        this._bodyInit = new Blob([this._bodyArrayBuffer])
                    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                        this._bodyArrayBuffer = bufferClone(body)
                    } else {
                        throw new Error('unsupported BodyInit type')
                    }

                    if (!this.headers.get('content-type')) {
                        if (typeof body === 'string') {
                            this.headers.set('content-type', 'text/plain;charset=UTF-8')
                        } else if (this._bodyBlob && this._bodyBlob.type) {
                            this.headers.set('content-type', this._bodyBlob.type)
                        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
                        }
                    }
                }

                if (support.blob) {
                    this.blob = function () {
                        var rejected = consumed(this)
                        if (rejected) {
                            return rejected
                        }

                        if (this._bodyBlob) {
                            return Promise.resolve(this._bodyBlob)
                        } else if (this._bodyArrayBuffer) {
                            return Promise.resolve(new Blob([this._bodyArrayBuffer]))
                        } else if (this._bodyFormData) {
                            throw new Error('could not read FormData body as blob')
                        } else {
                            return Promise.resolve(new Blob([this._bodyText]))
                        }
                    }

                    this.arrayBuffer = function () {
                        if (this._bodyArrayBuffer) {
                            return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
                        } else {
                            return this.blob().then(readBlobAsArrayBuffer)
                        }
                    }
                }

                this.text = function () {
                    var rejected = consumed(this)
                    if (rejected) {
                        return rejected
                    }

                    if (this._bodyBlob) {
                        return readBlobAsText(this._bodyBlob)
                    } else if (this._bodyArrayBuffer) {
                        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
                    } else if (this._bodyFormData) {
                        throw new Error('could not read FormData body as text')
                    } else {
                        return Promise.resolve(this._bodyText)
                    }
                }

                if (support.formData) {
                    this.formData = function () {
                        return this.text().then(decode)
                    }
                }

                this.json = function () {
                    return this.text().then(JSON.parse)
                }

                return this
            }

            // HTTP methods whose capitalization should be normalized
            var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

            function normalizeMethod(method) {
                var upcased = method.toUpperCase()
                return (methods.indexOf(upcased) > -1) ? upcased : method
            }

            function Request(input, options) {
                options = options || {}
                var body = options.body

                if (typeof input === 'string') {
                    this.url = input
                } else {
                    if (input.bodyUsed) {
                        throw new TypeError('Already read')
                    }
                    this.url = input.url
                    this.credentials = input.credentials
                    if (!options.headers) {
                        this.headers = new Headers(input.headers)
                    }
                    this.method = input.method
                    this.mode = input.mode
                    if (!body && input._bodyInit != null) {
                        body = input._bodyInit
                        input.bodyUsed = true
                    }
                }

                this.credentials = options.credentials || this.credentials || 'omit'
                if (options.headers || !this.headers) {
                    this.headers = new Headers(options.headers)
                }
                this.method = normalizeMethod(options.method || this.method || 'GET')
                this.mode = options.mode || this.mode || null
                this.referrer = null

                if ((this.method === 'GET' || this.method === 'HEAD') && body) {
                    throw new TypeError('Body not allowed for GET or HEAD requests')
                }
                this._initBody(body)
            }

            Request.prototype.clone = function () {
                return new Request(this, {body: this._bodyInit})
            }

            function decode(body) {
                var form = new FormData()
                body.trim().split('&').forEach(function (bytes) {
                    if (bytes) {
                        var split = bytes.split('=')
                        var name = split.shift().replace(/\+/g, ' ')
                        var value = split.join('=').replace(/\+/g, ' ')
                        form.append(decodeURIComponent(name), decodeURIComponent(value))
                    }
                })
                return form
            }

            function parseHeaders(rawHeaders) {
                var headers = new Headers()
                rawHeaders.split('\r\n').forEach(function (line) {
                    var parts = line.split(':')
                    var key = parts.shift().trim()
                    if (key) {
                        var value = parts.join(':').trim()
                        headers.append(key, value)
                    }
                })
                return headers
            }

            Body.call(Request.prototype)

            function Response(bodyInit, options) {
                if (!options) {
                    options = {}
                }

                this.type = 'default'
                this.status = 'status' in options ? options.status : 200
                this.ok = this.status >= 200 && this.status < 300
                this.statusText = 'statusText' in options ? options.statusText : 'OK'
                this.headers = new Headers(options.headers)
                this.url = options.url || ''
                this._initBody(bodyInit)
            }

            Body.call(Response.prototype)

            Response.prototype.clone = function () {
                return new Response(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new Headers(this.headers),
                    url: this.url
                })
            }

            Response.error = function () {
                var response = new Response(null, {status: 0, statusText: ''})
                response.type = 'error'
                return response
            }

            var redirectStatuses = [301, 302, 303, 307, 308]

            Response.redirect = function (url, status) {
                if (redirectStatuses.indexOf(status) === -1) {
                    throw new RangeError('Invalid status code')
                }

                return new Response(null, {status: status, headers: {location: url}})
            }

            self.Headers = Headers
            self.Request = Request
            self.Response = Response

            self.fetch = function (input, init) {
                return new Promise(function (resolve, reject) {
                    var request = new Request(input, init)
                    var xhr = new XMLHttpRequest()

                    xhr.onload = function () {
                        var options = {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                        }
                        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
                        var body = 'response' in xhr ? xhr.response : xhr.responseText
                        resolve(new Response(body, options))
                    }

                    xhr.onerror = function () {
                        reject(new TypeError('Network request failed'))
                    }

                    xhr.ontimeout = function () {
                        reject(new TypeError('Network request failed'))
                    }

                    xhr.open(request.method, request.url, true)

                    if (request.credentials === 'include') {
                        xhr.withCredentials = true
                    }

                    if ('responseType' in xhr && support.blob) {
                        xhr.responseType = 'blob'
                    }

                    request.headers.forEach(function (value, name) {
                        xhr.setRequestHeader(name, value)
                    })

                    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
                })
            }
            self.fetch.polyfill = true
        })(typeof self !== 'undefined' ? self : this);


        /***/
    },
    /* 2 */
    /***/ function (module, exports, __webpack_require__) {

        "use strict";
        var React = __webpack_require__(3);
        var ReactDOM = __webpack_require__(4);
        __webpack_require__(5);
        var App_1 = __webpack_require__(9);
        ReactDOM.render(React.createElement(App_1.App, null), document.getElementById("root"));


        /***/
    },
    /* 3 */
    /***/ function (module, exports) {

        module.exports = React;

        /***/
    },
    /* 4 */
    /***/ function (module, exports) {

        module.exports = ReactDOM;

        /***/
    },
    /* 5 */
    /***/ function (module, exports) {

        // removed by extract-text-webpack-plugin

        /***/
    },
    /* 6 */,
    /* 7 */,
    /* 8 */,
    /* 9 */
    /***/ function (module, exports, __webpack_require__) {

        "use strict";
        var __extends = (this && this.__extends) || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                function __() {
                    this.constructor = d;
                }

                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        var React = __webpack_require__(3);
        __webpack_require__(1);
        var Camper_1 = __webpack_require__(10);
        __webpack_require__(11);
        var App = (function (_super) {
            __extends(App, _super);
            function App(props) {
                var _this = _super.call(this, props) || this;
                _this.handleRecent = function () {
                    _this.fetchArray("https://fcctop100.herokuapp.com/api/fccusers/top/recent").catch(function (err) {
                        console.log(err);
                    });
                };
                _this.handleAllTime = function () {
                    _this.fetchArray("https://fcctop100.herokuapp.com/api/fccusers/top/allTime").catch(function (err) {
                        console.log(err);
                    });
                };
                _this.state = {
                    "camperArray": []
                };
                return _this;
            }
            ;
            App.prototype.fetchArray = function (url) {
                var _this = this;
                return fetch(url, {
                    "method": "GET",
                    "mode": "cors",
                    "headers": new Headers({
                        "Content-Type": "application/json"
                    })
                }).then(function (response) {
                    return response.json();
                }).then(function (res) {
                    _this.setState({camperArray: res});
                    return res;
                });
            };
            App.prototype.componentDidMount = function () {
                this.fetchArray("https://fcctop100.herokuapp.com/api/fccusers/top/recent").catch(function (err) {
                    console.log(err);
                });
            };
            App.prototype.render = function () {
                return (React.createElement("div", null,
                    React.createElement("header", null,
                        React.createElement("h1", {className: "Title"}, "Camper Leaderboard")),
                    React.createElement("main", null,
                        React.createElement("div", null,
                            React.createElement("table", null,
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, "Camper"),
                                        React.createElement("th", {onClick: this.handleRecent}, "Last 30 Days"),
                                        React.createElement("th", {onClick: this.handleAllTime}, "All-Time"))),
                                React.createElement(Camper_1.Camper, {camperArray: this.state.camperArray})))),
                    React.createElement("footer", null,
                        React.createElement("div", {className: "Credits"},
                            React.createElement("small", null,
                                "powered by ",
                                React.createElement("img", {
                                    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4NDEuOSA1OTUuMyI+ICAgIDxnIGZpbGw9IiM2MURBRkIiPiAgICAgICAgPHBhdGggZD0iTTY2Ni4zIDI5Ni41YzAtMzIuNS00MC43LTYzLjMtMTAzLjEtODIuNCAxNC40LTYzLjYgOC0xMTQuMi0yMC4yLTEzMC40LTYuNS0zLjgtMTQuMS01LjYtMjIuNC01LjZ2MjIuM2M0LjYgMCA4LjMuOSAxMS40IDIuNiAxMy42IDcuOCAxOS41IDM3LjUgMTQuOSA3NS43LTEuMSA5LjQtMi45IDE5LjMtNS4xIDI5LjQtMTkuNi00LjgtNDEtOC41LTYzLjUtMTAuOS0xMy41LTE4LjUtMjcuNS0zNS4zLTQxLjYtNTAgMzIuNi0zMC4zIDYzLjItNDYuOSA4NC00Ni45Vjc4Yy0yNy41IDAtNjMuNSAxOS42LTk5LjkgNTMuNi0zNi40LTMzLjgtNzIuNC01My4yLTk5LjktNTMuMnYyMi4zYzIwLjcgMCA1MS40IDE2LjUgODQgNDYuNi0xNCAxNC43LTI4IDMxLjQtNDEuMyA0OS45LTIyLjYgMi40LTQ0IDYuMS02My42IDExLTIuMy0xMC00LTE5LjctNS4yLTI5LTQuNy0zOC4yIDEuMS02Ny45IDE0LjYtNzUuOCAzLTEuOCA2LjktMi42IDExLjUtMi42Vjc4LjVjLTguNCAwLTE2IDEuOC0yMi42IDUuNi0yOC4xIDE2LjItMzQuNCA2Ni43LTE5LjkgMTMwLjEtNjIuMiAxOS4yLTEwMi43IDQ5LjktMTAyLjcgODIuMyAwIDMyLjUgNDAuNyA2My4zIDEwMy4xIDgyLjQtMTQuNCA2My42LTggMTE0LjIgMjAuMiAxMzAuNCA2LjUgMy44IDE0LjEgNS42IDIyLjUgNS42IDI3LjUgMCA2My41LTE5LjYgOTkuOS01My42IDM2LjQgMzMuOCA3Mi40IDUzLjIgOTkuOSA1My4yIDguNCAwIDE2LTEuOCAyMi42LTUuNiAyOC4xLTE2LjIgMzQuNC02Ni43IDE5LjktMTMwLjEgNjItMTkuMSAxMDIuNS00OS45IDEwMi41LTgyLjN6bS0xMzAuMi02Ni43Yy0zLjcgMTIuOS04LjMgMjYuMi0xMy41IDM5LjUtNC4xLTgtOC40LTE2LTEzLjEtMjQtNC42LTgtOS41LTE1LjgtMTQuNC0yMy40IDE0LjIgMi4xIDI3LjkgNC43IDQxIDcuOXptLTQ1LjggMTA2LjVjLTcuOCAxMy41LTE1LjggMjYuMy0yNC4xIDM4LjItMTQuOSAxLjMtMzAgMi00NS4yIDItMTUuMSAwLTMwLjItLjctNDUtMS45LTguMy0xMS45LTE2LjQtMjQuNi0yNC4yLTM4LTcuNi0xMy4xLTE0LjUtMjYuNC0yMC44LTM5LjggNi4yLTEzLjQgMTMuMi0yNi44IDIwLjctMzkuOSA3LjgtMTMuNSAxNS44LTI2LjMgMjQuMS0zOC4yIDE0LjktMS4zIDMwLTIgNDUuMi0yIDE1LjEgMCAzMC4yLjcgNDUgMS45IDguMyAxMS45IDE2LjQgMjQuNiAyNC4yIDM4IDcuNiAxMy4xIDE0LjUgMjYuNCAyMC44IDM5LjgtNi4zIDEzLjQtMTMuMiAyNi44LTIwLjcgMzkuOXptMzIuMy0xM2M1LjQgMTMuNCAxMCAyNi44IDEzLjggMzkuOC0xMy4xIDMuMi0yNi45IDUuOS00MS4yIDggNC45LTcuNyA5LjgtMTUuNiAxNC40LTIzLjcgNC42LTggOC45LTE2LjEgMTMtMjQuMXpNNDIxLjIgNDMwYy05LjMtOS42LTE4LjYtMjAuMy0yNy44LTMyIDkgLjQgMTguMi43IDI3LjUuNyA5LjQgMCAxOC43LS4yIDI3LjgtLjctOSAxMS43LTE4LjMgMjIuNC0yNy41IDMyem0tNzQuNC01OC45Yy0xNC4yLTIuMS0yNy45LTQuNy00MS03LjkgMy43LTEyLjkgOC4zLTI2LjIgMTMuNS0zOS41IDQuMSA4IDguNCAxNiAxMy4xIDI0IDQuNyA4IDkuNSAxNS44IDE0LjQgMjMuNHpNNDIwLjcgMTYzYzkuMyA5LjYgMTguNiAyMC4zIDI3LjggMzItOS0uNC0xOC4yLS43LTI3LjUtLjctOS40IDAtMTguNy4yLTI3LjguNyA5LTExLjcgMTguMy0yMi40IDI3LjUtMzJ6bS03NCA1OC45Yy00LjkgNy43LTkuOCAxNS42LTE0LjQgMjMuNy00LjYgOC04LjkgMTYtMTMgMjQtNS40LTEzLjQtMTAtMjYuOC0xMy44LTM5LjggMTMuMS0zLjEgMjYuOS01LjggNDEuMi03Ljl6bS05MC41IDEyNS4yYy0zNS40LTE1LjEtNTguMy0zNC45LTU4LjMtNTAuNiAwLTE1LjcgMjIuOS0zNS42IDU4LjMtNTAuNiA4LjYtMy43IDE4LTcgMjcuNy0xMC4xIDUuNyAxOS42IDEzLjIgNDAgMjIuNSA2MC45LTkuMiAyMC44LTE2LjYgNDEuMS0yMi4yIDYwLjYtOS45LTMuMS0xOS4zLTYuNS0yOC0xMC4yek0zMTAgNDkwYy0xMy42LTcuOC0xOS41LTM3LjUtMTQuOS03NS43IDEuMS05LjQgMi45LTE5LjMgNS4xLTI5LjQgMTkuNiA0LjggNDEgOC41IDYzLjUgMTAuOSAxMy41IDE4LjUgMjcuNSAzNS4zIDQxLjYgNTAtMzIuNiAzMC4zLTYzLjIgNDYuOS04NCA0Ni45LTQuNS0uMS04LjMtMS0xMS4zLTIuN3ptMjM3LjItNzYuMmM0LjcgMzguMi0xLjEgNjcuOS0xNC42IDc1LjgtMyAxLjgtNi45IDIuNi0xMS41IDIuNi0yMC43IDAtNTEuNC0xNi41LTg0LTQ2LjYgMTQtMTQuNyAyOC0zMS40IDQxLjMtNDkuOSAyMi42LTIuNCA0NC02LjEgNjMuNi0xMSAyLjMgMTAuMSA0LjEgMTkuOCA1LjIgMjkuMXptMzguNS02Ni43Yy04LjYgMy43LTE4IDctMjcuNyAxMC4xLTUuNy0xOS42LTEzLjItNDAtMjIuNS02MC45IDkuMi0yMC44IDE2LjYtNDEuMSAyMi4yLTYwLjYgOS45IDMuMSAxOS4zIDYuNSAyOC4xIDEwLjIgMzUuNCAxNS4xIDU4LjMgMzQuOSA1OC4zIDUwLjYtLjEgMTUuNy0yMyAzNS42LTU4LjQgNTAuNnpNMzIwLjggNzguNHoiLz4gICAgICAgIDxjaXJjbGUgY3g9IjQyMC45IiBjeT0iMjk2LjUiIHI9IjQ1LjciLz4gICAgICAgIDxwYXRoIGQ9Ik01MjAuNSA3OC4xeiIvPiAgICA8L2c+PC9zdmc+",
                                    className: "App-logo",
                                    alt: "logo"
                                }))))));
            };
            return App;
        }(React.Component));
        exports.App = App;


        /***/
    },
    /* 10 */
    /***/ function (module, exports, __webpack_require__) {

        "use strict";
        var __extends = (this && this.__extends) || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                function __() {
                    this.constructor = d;
                }

                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        var React = __webpack_require__(3);
        var Camper = (function (_super) {
            __extends(Camper, _super);
            function Camper() {
                return _super !== null && _super.apply(this, arguments) || this;
            }

            Camper.prototype.render = function () {
                return (React.createElement("tbody", {className: "Camper"}, this.props.camperArray.map(function (camper) {
                    return (React.createElement("tr", {className: "Camper", key: camper["username"]},
                        React.createElement("td", null,
                            React.createElement("img", {src: camper["img"], alt: "portrait", className: "Camper-pic"}),
                            camper["username"]),
                        React.createElement("td", {className: "Text-center"}, camper["recent"]),
                        React.createElement("td", {className: "Text-center"}, camper["alltime"])));
                })));
            };
            return Camper;
        }(React.Component));
        exports.Camper = Camper;


        /***/
    },
    /* 11 */
    /***/ function (module, exports) {

        // removed by extract-text-webpack-plugin

        /***/
    }
    /******/]);
//# sourceMappingURL=bundle.js.map