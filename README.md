# Backbone.LinkedCollection

Backbone.js plugin to make Backbone.Collection smarter. Consumes Link field
([RFC 5988](http://tools.ietf.org/html/rfc5988#page-6)) in the HTTP Response
header to enable Web Linking between sections of list resources.

## What do you mean?

Web Linking is a technique used to describe relationships between two or more
resources on the web. If you have used:

	<link href="http://cdn.domain.com/css/bootstrap.css" rel="stylesheet">

then you are familiar with web linking. What it is describing is that the
HTML page you're viewing has a related resource of type `stylesheet` at the
provided `href`.

## And what's does this have to do with Backbone.Collection?

Nothing. But we can experiment with it to come up with a set of conventions
that make our Backbone.js collections a little smarter.

## How?

Imagine the following links:

	<link href="http://api.com/contacts" rel="first">
	<link href="http://api.com/contacts?page=2" rel="prev">
	<link href="http://api.com/contacts?page=3" rel="next">
	<link href="http://api.com/contacts?page=23445" rel="last">

What RFC 5988 allows is to use the same semantics in the HTTP
response header. So, provided that you call a list resource within some API, it
can provide you with how to obtain other portions of the same list resource.

Take a look at this request to [Github Gists API](http://developer.github.com/v3/gists/):

	$ curl -I https://api.github.com/gists/public
	HTTP/1.1 200 OK
	Link: <https://api.github.com/gists/public?page=2>; rel="next", <https://api.github.com/gists/public?page=23914>; rel="last"

See that? It means from 1 initial request, we now know what related resources
there are for this particular list resource. Therefore by taking advantage of
this information, we can formulate a smarter Backbone.Collection which I have
named Backbone.LinkedCollection.

## So what's new?

In Backbone.LinkedCollection, there are 4 new methods:

```javascript
var gists = new Backbone.LinkedCollection({
	url: 'https://api.github.com/gists/public',
	model: Demo.Models.Gist
});

// Get public gists
gists.fetch();

// All of the methods below have the same paramter signature as `fetch`

// Go to the first page
gists.first();

// Get the previous set
gists.prev();

// Get the next set
gists.next();

// Go to the last page
gists.last();
```

A simple demo is here: http://jsfiddle.net/davidhong/gAyAx/

## Issues & Resolutions

### It is not a paging replacement

Whilst HTTP Link field can contain more links than the 4 mentioned above,
it is not practical to include all pages. Thus, this should not be a replacement
for paged lists. Instead this could be useful for sequential lists such as
Twitter streams.

### PEG.js based HTTP Link field parser

Is too big. A simple `page` and `per_page` implementation would be more ideal
if you're looking for something small. One main advantage of HTTP Link field is
that resource end-point is absolute as it is given to us by the server.

### No support for bootstrapping of models

Since this is based HTTP Link field, at least one response is required to find
out about linked resources. Ideally, a collection should have an option to be
bootstrapped instead of fetching on start-up.

### Many more

As mentioned earlier, this is an experiement.

## Further notes

I think this idea could be useful on Backbone.Model as well. HTTP Link field is
not limited to list resources, but can extend to cater for different resources.

## TODO

1. Migrate the sources from jsbin/jsfiddle/gist/wherever
2. Write some tests
3. Fix code
4. Tasks
