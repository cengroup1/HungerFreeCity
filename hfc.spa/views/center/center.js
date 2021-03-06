var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../scripts/common.ts" />
var hfc;
(function (hfc) {
    var centervm = (function (_super) {
        __extends(centervm, _super);
        function centervm() {
            _super.apply(this, arguments);
            this.canEdit = false;
            this.CenterTypes = hfc.common.CenterTypes;
        }
        centervm.prototype.doAction = function (e) {
            var _this = this;
            if (e.id === "edit") {
                this.set("canEdit", true);
            }
            else if (e.id === "save") {
                // Save the record
                var item = this.get("item");
                var clone = JSON.parse(JSON.stringify(item)); // cheap way to get a deep clone
                delete clone.favorite; // remove this property
                delete clone.refkey; // remove this property
                clone.lastModified = new Date().toISOString();
                // common.log("saving center data " + JSON.stringify(clone));
                hfc.common.firebase
                    .child(item.refkey)
                    .update(clone)
                    .then(function () {
                    hfc.common.successToast("Center saved successfully.");
                    _this.set("canEdit", false);
                })
                    .catch(function (error) {
                    hfc.common.errorToast("Data could not be saved." + error);
                });
            }
        };
        centervm.prototype.setup = function (item) {
            this.set("item", item);
        };
        centervm.prototype.init = function () {
            //super.init();
        };
        return centervm;
    }(kendo.data.ObservableObject));
    hfc.centervm = centervm;
})(hfc || (hfc = {}));
define([
    'text!/views/center/center.html'
], function (template) {
    var vm = new hfc.centervm();
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=center.js.map