/**
 * Properties:
 *
 * - link: contains object for each link type
 *
 * Methods provided by LinkedCollection
 *
 * - jump
 * - first
 * - prev
 * - next
 * - last
 */
Backbone.LinkedCollection = (function (parser) {

// No need to trash our collection prototype with yet another property.

	var find = function (link, type) {
		return _.find(link || [], function (value) {
			return value.rel == type;
		});
	};

	var LinkedCollection = Backbone.Collection.extend({

// Unfortunately, the way original `fetch` is written, we need to completely
// replace the method.

		fetch: function (options) {
			options = options ? _.clone(options) : {};
			if (options.parse === void 0) options.parse = true;
			var collection = this;
			var success = options.success;
			options.success = function (resp, status, xhr) {
				var method = options.update ? 'update' : 'reset';
				var link = xhr.getResponseHeader('Link');
				if (link) collection.link = parser.parse(link);
				collection[method](resp, options);
				if (success) success(collection, resp, options);
			};
			return this.sync('read', this, options);
		},

//
// As of Backbone 0.9.9 `parse` function no longer receives xhr object as its
// function is to parse the received data not transmission. Because of this
// change, we will need to replace the `fetch` function.
//
//		parse: function (response, xhr) {
//			var link = xhr.getResponseHeader('Link');
//
//			if (link) {
//				this.link = parser.parse(link);
//			}
//
//			return Backbone.Collection.prototype.parse.apply(this, arguments);
//		},

// Jump to a given related link as specified by the `rel` attribute.

		jump: function (type, options) {
			var link = find(this.link, type);
			if (link && link.href) {
				this.url = link.href;
				return this.fetch(options);
			}
		}
	});

// As a collection, the only type of related links that we care about are the
// the following 4 methods. You can use `jump` directly, however types such as
// `document`, `external` won't make sense in this context. We can probably
// make `Backbone.Model` smarter as well using similar Web Linking techniques
// however, that is not part of this exercise.

	_.each(['first', 'prev', 'next', 'last'], function  (method) {
		LinkedCollection.prototype[method] = function (options) {
			return this.jump(method, options);
		};
	});

	return LinkedCollection;

}(parser));
