/* vim: set noexpandtab ts=4 sw=4 ai si: */

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
		parse: function (response, xhr) {
			var link = xhr.getResponseHeader('Link');

			if (link) {
				this.link = parser.parse(link);
			}

			return Backbone.Collection.prototype.parse.apply(this, arguments);
		},

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
