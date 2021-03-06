﻿/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class allvm extends kendo.data.ObservableObject {
        public centers = new kendo.data.ObservableArray([]);

        public init(): void {
        }

		public constructor() {
            super();
			var that = this;

			$.subscribe("loggedIn", () => {
                common.firebase.child("centers").on("value", data => {
					that.centers.length = 0;	// clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (common.User) {
						var all = [];
						// convert object to an array
						data.forEach(v => {
							var c = v.val();
                            c.favorite = $.inArray(c.centerid, common.User.favorites) >= 0;
							if (!c.needs) c.needs = [];
							all.push(c);
						});
						all.sort((a: any, b: any) => {
							if (a.favorite === b.favorite) return a.name.localeCompare(b.name);
							return a.favorite ? -1 : 1;
						});
                        all.forEach(v => {
							that.centers.push(v);
                        });
                    }
                });
            });

			that.centers.bind("change", e => {
				if (e.action === "itemchange" && e.field === "favorite") {
					// so change the user's favorites and persist
					hfc.common.User.favorites = that.centers
						.filter((v: any) => v.favorite)
						.map((v: any) => v.centerid);
					//hfc.common.log("favorites are " + JSON.stringify(common.User.favorites));
					$.publish("saveFavorites");
				}
			});
        }
    }
}

define([
    "text!/views/all/all.html"
], (template) => {
    var vm = new hfc.allvm();
    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
});