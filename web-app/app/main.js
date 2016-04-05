System.register(['rxjs/add/operator/map', 'angular2/platform/browser', 'angular2/core', 'angular2/http', './components/dashboard/app.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var browser_1, core_1, http_1, app_component_1;
    var MyOptions;
    return {
        setters:[
            function (_1) {},
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            MyOptions = (function (_super) {
                __extends(MyOptions, _super);
                function MyOptions() {
                    _super.call(this, {
                        method: http_1.RequestMethod.Get,
                        headers: new http_1.Headers({
                            'Access-Control-Allow-Origin': '*'
                        })
                    });
                }
                return MyOptions;
            }(http_1.RequestOptions));
            browser_1.bootstrap(app_component_1.AppComponent, [
                http_1.HTTP_PROVIDERS,
                core_1.provide(http_1.RequestOptions, { useClass: MyOptions })
            ])
                .catch(function (err) { return console.error(err); });
        }
    }
});
//# sourceMappingURL=main.js.map