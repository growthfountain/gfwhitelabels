var Backbone = {};

// Backbone.Events
// ---------------

// A module that can be mixed in to *any object* in order to provide it with
// a custom event channel. You may bind a callback to an event with `on` or
// remove with `off`; `trigger`-ing an event fires all callbacks in
// succession.
//
//     var object = {};
//     _.extend(object, Backbone.Events);
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//

var counter = 0;
function uniqueId(s) {
	counter ++;
	return s + counter;
}

function isEmpty(obj) {
	if (obj == null) return true;
	if (Array.isArray(obj) || typeof obj == 'string') return obj.length === 0;
	return Object.keys(obj).length === 0;
};


// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
// This accumulates the arguments passed into an array, after a given index.
var restArgs = function(func, startIndex) {
	startIndex = startIndex == null ? func.length - 1 : +startIndex;
	return function() {
		var length = Math.max(arguments.length - startIndex, 0),
		rest = Array(length),
		index = 0;
		for (; index < length; index++) {
			rest[index] = arguments[index + startIndex];
		}
		switch (startIndex) {
			case 0: return func.call(this, rest);
			case 1: return func.call(this, arguments[0], rest);
			case 2: return func.call(this, arguments[0], arguments[1], rest);
		}
		var args = Array(startIndex + 1);
		for (index = 0; index < startIndex; index++) {
			args[index] = arguments[index];
		}
		args[startIndex] = rest;
		return func.apply(this, args);
	};
};

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var partial = restArgs(function(func, boundArgs) {
	var placeholder = partial.placeholder;
	var bound = function() {
		var position = 0, length = boundArgs.length;
		var args = Array(length);
		for (var i = 0; i < length; i++) {
			args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
		}
		while (position < arguments.length) args.push(arguments[position++]);
		return executeBound(func, bound, this, this, args);
	};
	return bound;
});

partial.placeholder = '';

// Returns a function that will only be executed up to (but not including) the Nth call.
var before = function(times, func) {
	var memo;
	return function() {
		if (--times > 0) {
			memo = func.apply(this, arguments);
		}
		if (times <= 1) func = null;
		return memo;
	};
};

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
var once = partial(before, 2);

var Events = Backbone.Events = {};

// Regular expression used to split event strings.
var eventSplitter = /\s+/;

// A private global variable to share between listeners and listenees.
var _listening;

// Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`).
var eventsApi = function(iteratee, events, name, callback, opts) {
	var i = 0, names;
	if (name && typeof name === 'object') {
		// Handle event maps.
		if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
		for (names = Object.keys(name); i < names.length ; i++) {
			events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
		}
	} else if (name && eventSplitter.test(name)) {
		// Handle space-separated event names by delegating them individually.
		for (names = name.split(eventSplitter); i < names.length; i++) {
			events = iteratee(events, names[i], callback, opts);
		}
	} else {
		// Finally, standard events.
		events = iteratee(events, name, callback, opts);
	}
	return events;
};

// Bind an event to a `callback` function. Passing `"all"` will bind
// the callback to all events fired.
Events.on = function(name, callback, context) {
	this._events = eventsApi(onApi, this._events || {}, name, callback, {
		context: context,
		ctx: this,
		listening: _listening
	});

	if (_listening) {
		var listeners = this._listeners || (this._listeners = {});
		listeners[_listening.id] = _listening;
		// Allow the listening to use a counter, instead of tracking
		// callbacks for library interop
		_listening.interop = false;
	}

	return this;
};

// Inversion-of-control versions of `on`. Tell *this* object to listen to
// an event in another object... keeping track of what it's listening to
// for easier unbinding later.
Events.listenTo = function(obj, name, callback) {
	if (!obj) return this;
	var id = obj._listenId || (obj._listenId = uniqueId('l'));
	var listeningTo = this._listeningTo || (this._listeningTo = {});
	var listening = _listening = listeningTo[id];

	// This object is not listening to any other events on `obj` yet.
	// Setup the necessary references to track the listening callbacks.
	if (!listening) {
		this._listenId || (this._listenId = uniqueId('l'));
		listening = _listening = listeningTo[id] = new Listening(this, obj);
	}

	// Bind callbacks on obj.
	var error = tryCatchOn(obj, name, callback, this);
	_listening = void 0;

	if (error) throw error;
	// If the target obj is not Backbone.Events, track events manually.
	if (listening.interop) listening.on(name, callback);

	return this;
};

// The reducing API that adds a callback to the `events` object.
var onApi = function(events, name, callback, options) {
	if (callback) {
		var handlers = events[name] || (events[name] = []);
		var context = options.context, ctx = options.ctx, listening = options.listening;
		if (listening) listening.count++;

		handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
	}
	return events;
};

// An try-catch guarded #on function, to prevent poisoning the global
// `_listening` variable.
var tryCatchOn = function(obj, name, callback, context) {
	try {
		obj.on(name, callback, context);
	} catch (e) {
		return e;
	}
};

// Remove one or many callbacks. If `context` is null, removes all
// callbacks with that function. If `callback` is null, removes all
// callbacks for the event. If `name` is null, removes all bound
// callbacks for all events.
Events.off = function(name, callback, context) {
	if (!this._events) return this;
	this._events = eventsApi(offApi, this._events, name, callback, {
		context: context,
		listeners: this._listeners
	});

	return this;
};

// Tell this object to stop listening to either specific events ... or
// to every object it's currently listening to.
Events.stopListening = function(obj, name, callback) {
	var listeningTo = this._listeningTo;
	if (!listeningTo) return this;

	var ids = obj ? [obj._listenId] : Object.keys(listeningTo);
	for (var i = 0; i < ids.length; i++) {
		var listening = listeningTo[ids[i]];

		// If listening doesn't exist, this object is not currently
		// listening to obj. Break out early.
		if (!listening) break;

		listening.obj.off(name, callback, this);
		if (listening.interop) listening.off(name, callback);
	}
	if (isEmpty(listeningTo)) this._listeningTo = void 0;

	return this;
};

// The reducing API that removes a callback from the `events` object.
var offApi = function(events, name, callback, options) {
	if (!events) return;

	var context = options.context, listeners = options.listeners;
	var i = 0, names;

	// Delete all event listeners and "drop" events.
	if (!name && !context && !callback) {
		for (names = Object.keys(listeners); i < names.length; i++) {
			listeners[names[i]].cleanup();
		}
		return;
	}

	names = name ? [name] : Object.keys(events);
	for (; i < names.length; i++) {
		name = names[i];
		var handlers = events[name];

		// Bail out if there are no events stored.
		if (!handlers) break;

		// Find any remaining events.
		var remaining = [];
		for (var j = 0; j < handlers.length; j++) {
			var handler = handlers[j];
			if (
					callback && callback !== handler.callback &&
					callback !== handler.callback._callback ||
					context && context !== handler.context
				 ) {
				remaining.push(handler);
			} else {
				var listening = handler.listening;
				if (listening) listening.off(name, callback);
			}
		}

		// Replace events if there are any remaining.  Otherwise, clean up.
		if (remaining.length) {
			events[name] = remaining;
		} else {
			delete events[name];
		}
	}

	return events;
};

// Bind an event to only be triggered a single time. After the first time
// the callback is invoked, its listener will be removed. If multiple events
// are passed in using the space-separated syntax, the handler will fire
// once for each event, not once for a combination of all events.
Events.once = function(name, callback, context) {
	// Map the event into a `{event: once}` object.
	var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
	if (typeof name === 'string' && context == null) callback = void 0;
	return this.on(events, callback, context);
};

// Inversion-of-control versions of `once`.
Events.listenToOnce = function(obj, name, callback) {
	// Map the event into a `{event: once}` object.
	var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
	return this.listenTo(obj, events);
};

// Reduces the event callbacks into a map of `{event: onceWrapper}`.
// `offer` unbinds the `onceWrapper` after it has been called.
var onceMap = function(map, name, callback, offer) {
	if (callback) {
		var once = map[name] = once(function() {
			offer(name, once);
			callback.apply(this, arguments);
		});
		once._callback = callback;
	}
	return map;
};

// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
Events.trigger = function(name) {
	if (!this._events) return this;

	var length = Math.max(0, arguments.length - 1);
	var args = Array(length);
	for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

	eventsApi(triggerApi, this._events, name, void 0, args);
	return this;
};

// Handles triggering the appropriate event callbacks.
var triggerApi = function(objEvents, name, callback, args) {
	if (objEvents) {
		var events = objEvents[name];
		var allEvents = objEvents.all;
		if (events && allEvents) allEvents = allEvents.slice();
		if (events) triggerEvents(events, args);
		if (allEvents) triggerEvents(allEvents, [name].concat(args));
	}
	return objEvents;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
var triggerEvents = function(events, args) {
	var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	switch (args.length) {
		case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
		case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
		case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
		case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
		default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
	}
};

// A listening class that tracks and cleans up memory bindings
// when all callbacks have been offed.
var Listening = function(listener, obj) {
	this.id = listener._listenId;
	this.listener = listener;
	this.obj = obj;
	this.interop = true;
	this.count = 0;
	this._events = void 0;
};

Listening.prototype.on = Events.on;

// Offs a callback (or several).
// Uses an optimized counter if the listenee uses Backbone.Events.
// Otherwise, falls back to manual tracking to support events
// library interop.
Listening.prototype.off = function(name, callback) {
	var cleanup;
	if (this.interop) {
		this._events = eventsApi(offApi, this._events, name, callback, {
			context: void 0,
			listeners: void 0
		});
		cleanup = !this._events;
	} else {
		this.count--;
		cleanup = this.count === 0;
	}
	if (cleanup) this.cleanup();
};

// Cleans up memory bindings between the listener and the listenee.
Listening.prototype.cleanup = function() {
	delete this.listener._listeningTo[this.obj._listenId];
	if (!this.interop) delete this.obj._listeners[this.id];
};

// Aliases for backwards compatibility.
Events.bind   = Events.on;
Events.unbind = Events.off;

// Allow the `Backbone` object to serve as a global event bus, for folks who
// want global "pubsub" in a convenient place.
Object.assign(Backbone, Events);

// Backbone.Router
// ---------------

// Routers map faux-URLs to actions, and fire events when routes are
// matched. Creating a new one sets its `routes` hash, if not set statically.
var Router = Backbone.Router = function(options) {
	options || (options = {});
	this.preinitialize.apply(this, arguments);
	if (options.routes) this.routes = options.routes;
	this._bindRoutes();
	this.initialize.apply(this, arguments);
};

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Set up all inheritable **Backbone.Router** properties and methods.
Object.assign(Router.prototype, Events, {

	// preinitialize is an empty function by default. You can override it with a function
	// or object.  preinitialize will run before any instantiation logic is run in the Router.
	preinitialize: function(){},

	// Initialize is an empty function by default. Override it with your own
	// initialization logic.
	initialize: function(){},

	// Manually bind a single named route to a callback. For example:
	//
	//     this.route('search/:query/p:num', 'search', function(query, num) {
	//       ...
	//     });
	//
	route: function(route, name, callback) {
		if (typeof route != 'object') route = this._routeToRegExp(route);
		if (typeof name == 'function') {
			callback = name;
			name = '';
		}
		if (!callback) callback = this[name];
		var router = this;
		Backbone.history.route(route, function(fragment) {
			var args = router._extractParameters(route, fragment);
			if (router.execute(callback, args, name) !== false) {
				router.trigger.apply(router, ['route:' + name].concat(args));
				router.trigger('route', name, args);
				Backbone.history.trigger('route', router, name, args);
			}
		});
		return this;
	},

	// Execute a route handler with the provided parameters.  This is an
	// excellent place to do pre-route setup or post-route cleanup.
	execute: function(callback, args, name) {
		if (callback) callback.apply(this, args);
	},

	// Simple proxy to `Backbone.history` to save a fragment into the history.
	navigate: function(fragment, options) {
		Backbone.history.navigate(fragment, options);
		return this;
	},

	// Bind all defined routes to `Backbone.history`. We have to reverse the
	// order of the routes here to support behavior where the most general
	// routes can be defined at the bottom of the route map.
	_bindRoutes: function() {
		if (!this.routes) return;
		var route, routes = Object.keys(this.routes);
		while ((route = routes.pop()) != null) {
			this.route(route, this.routes[route]);
		}
	},

	// Convert a route string into a regular expression, suitable for matching
	// against the current location hash.
	_routeToRegExp: function(route) {
		route = route.replace(escapeRegExp, '\\$&')
			.replace(optionalParam, '(?:$1)?')
			.replace(namedParam, function(match, optional) {
				return optional ? match : '([^/?]+)';
			})
		.replace(splatParam, '([^?]*?)');
		return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	},

	// Given a route, and a URL fragment that it matches, return the array of
	// extracted decoded parameters. Empty or unmatched parameters will be
	// treated as `null` to normalize cross-browser behavior.
	_extractParameters: function(route, fragment) {
		var params = route.exec(fragment).slice(1);
		return params.map(function(param, i) {
			// Don't decode the search params.
			if (i === params.length - 1) return param || null;
			return param ? decodeURIComponent(param) : null;
		});
	}

});

// Backbone.History
// ----------------

// Handles cross-browser history management, based on either
// [pushState](http://diveintohtml5.info/history.html) and real URLs, or
// [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
// and URL fragments. If the browser supports neither (old IE, natch),
// falls back to polling.
var History = Backbone.History = function() {
	this.handlers = [];
	this.checkUrl = this.checkUrl.bind(this);

	// Ensure that `History` can be used outside of the browser.
	if (typeof window !== 'undefined') {
		this.location = window.location;
		this.history = window.history;
	}
};

// Cached regex for stripping a leading hash/slash and trailing space.
var routeStripper = /^[#\/]|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

// Cached regex for stripping urls of hash.
var pathStripper = /#.*$/;

// Has the history handling already been started?
History.started = false;

// Set up all inheritable **Backbone.History** properties and methods.
Object.assign(History.prototype, Events, {

	// The default interval to poll for hash changes, if necessary, is
	// twenty times a second.
	interval: 50,

	// Are we at the app root?
	atRoot: function() {
		var path = this.location.pathname.replace(/[^\/]$/, '$&/');
		return path === this.root && !this.getSearch();
	},

	// Does the pathname match the root?
	matchRoot: function() {
		var path = this.decodeFragment(this.location.pathname);
		var rootPath = path.slice(0, this.root.length - 1) + '/';
		return rootPath === this.root;
	},

	// Unicode characters in `location.pathname` are percent encoded so they're
	// decoded for comparison. `%25` should not be decoded since it may be part
	// of an encoded parameter.
	decodeFragment: function(fragment) {
		return decodeURI(fragment.replace(/%25/g, '%2525'));
	},

	// In IE6, the hash fragment and search params are incorrect if the
	// fragment contains `?`.
	getSearch: function() {
		var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
		return match ? match[0] : '';
	},

	// Gets the true hash value. Cannot use location.hash directly due to bug
	// in Firefox where location.hash will always be decoded.
	getHash: function(window) {
		var match = (window || this).location.href.match(/#(.*)$/);
		return match ? match[1] : '';
	},

	// Get the pathname and search params, without the root.
	getPath: function() {
		var path = this.decodeFragment(
				this.location.pathname + this.getSearch()
				).slice(this.root.length - 1);
		return path.charAt(0) === '/' ? path.slice(1) : path;
	},

	// Get the cross-browser normalized URL fragment from the path or hash.
	getFragment: function(fragment) {
		if (fragment == null) {
			if (this._usePushState || !this._wantsHashChange) {
				fragment = this.getPath();
			} else {
				fragment = this.getHash();
			}
		}
		return fragment.replace(routeStripper, '');
	},

	// Start the hash change handling, returning `true` if the current URL matches
	// an existing route, and `false` otherwise.
	start: function(options) {
		if (History.started) throw new Error('Backbone.history has already been started');
		History.started = true;

		// Figure out the initial configuration. Do we need an iframe?
		// Is pushState desired ... is it available?
		this.options          = Object.assign({root: '/'}, this.options, options);
		this.root             = this.options.root;
		this._wantsHashChange = this.options.hashChange !== false;
		this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
		this._useHashChange   = this._wantsHashChange && this._hasHashChange;
		this._wantsPushState  = !!this.options.pushState;
		this._hasPushState    = !!(this.history && this.history.pushState);
		this._usePushState    = this._wantsPushState && this._hasPushState;
		this.fragment         = this.getFragment();

		// Normalize root to always include a leading and trailing slash.
		this.root = ('/' + this.root + '/').replace(rootStripper, '/');

		// Transition from hashChange to pushState or vice versa if both are
		// requested.
		if (this._wantsHashChange && this._wantsPushState) {

			// If we've started off with a route from a `pushState`-enabled
			// browser, but we're currently in a browser that doesn't support it...
			if (!this._hasPushState && !this.atRoot()) {
				var rootPath = this.root.slice(0, -1) || '/';
				this.location.replace(rootPath + '#' + this.getPath());
				// Return immediately as browser will do redirect to new url
				return true;

				// Or if we've started out with a hash-based route, but we're currently
				// in a browser where it could be `pushState`-based instead...
			} else if (this._hasPushState && this.atRoot()) {
				this.navigate(this.getHash(), {replace: true});
			}

		}

		// Proxy an iframe to handle location events if the browser doesn't
		// support the `hashchange` event, HTML5 history, or the user wants
		// `hashChange` but not `pushState`.
		if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
			this.iframe = document.createElement('iframe');
			this.iframe.src = 'javascript:0';
			this.iframe.style.display = 'none';
			this.iframe.tabIndex = -1;
			var body = document.body;
			// Using `appendChild` will throw on IE < 9 if the document is not ready.
			var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
			iWindow.document.open();
			iWindow.document.close();
			iWindow.location.hash = '#' + this.fragment;
		}

		// Add a cross-platform `addEventListener` shim for older browsers.
		var addEventListener = window.addEventListener || function(eventName, listener) {
			return attachEvent('on' + eventName, listener);
		};

		// Depending on whether we're using pushState or hashes, and whether
		// 'onhashchange' is supported, determine how we check the URL state.
		if (this._usePushState) {
			addEventListener('popstate', this.checkUrl, false);
		} else if (this._useHashChange && !this.iframe) {
			addEventListener('hashchange', this.checkUrl, false);
		} else if (this._wantsHashChange) {
			this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
		}

		if (!this.options.silent) return this.loadUrl();
	},

	// Disable Backbone.history, perhaps temporarily. Not useful in a real app,
	// but possibly useful for unit testing Routers.
	stop: function() {
		// Add a cross-platform `removeEventListener` shim for older browsers.
		var removeEventListener = window.removeEventListener || function(eventName, listener) {
			return detachEvent('on' + eventName, listener);
		};

		// Remove window listeners.
		if (this._usePushState) {
			removeEventListener('popstate', this.checkUrl, false);
		} else if (this._useHashChange && !this.iframe) {
			removeEventListener('hashchange', this.checkUrl, false);
		}

		// Clean up the iframe if necessary.
		if (this.iframe) {
			document.body.removeChild(this.iframe);
			this.iframe = null;
		}

		// Some environments will throw when clearing an undefined interval.
		if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
		History.started = false;
	},

	// Add a route to be tested when the fragment changes. Routes added later
	// may override previous routes.
	route: function(route, callback) {
		this.handlers.unshift({route: route, callback: callback});
	},

	// Checks the current URL to see if it has changed, and if it has,
	// calls `loadUrl`, normalizing across the hidden iframe.
	checkUrl: function(e) {
		var current = this.getFragment();

		// If the user pressed the back button, the iframe's hash will have
		// changed and we should use that for comparison.
		if (current === this.fragment && this.iframe) {
			current = this.getHash(this.iframe.contentWindow);
		}

		if (current === this.fragment) return false;
		if (this.iframe) this.navigate(current);
		this.loadUrl();
	},

	// Attempt to load the current URL fragment. If a route succeeds with a
	// match, returns `true`. If no defined routes matches the fragment,
	// returns `false`.
	loadUrl: function(fragment) {
		// If the root doesn't match, no routes can match either.
		if (!this.matchRoot()) return false;
		fragment = this.fragment = this.getFragment(fragment);
		return this.handlers.some(function(handler) {
			if (handler.route.test(fragment)) {
				handler.callback(fragment);
				return true;
			}
		});
	},

	// Save a fragment into the hash history, or replace the URL state if the
	// 'replace' option is passed. You are responsible for properly URL-encoding
	// the fragment in advance.
	//
	// The options object can contain `trigger: true` if you wish to have the
	// route callback be fired (not usually desirable), or `replace: true`, if
	// you wish to modify the current URL without adding an entry to the history.
	navigate: function(fragment, options) {
		if (!History.started) return false;
		if (!options || options === true) options = {trigger: !!options};

		// Normalize the fragment.
		fragment = this.getFragment(fragment || '');

		// Don't include a trailing slash on the root.
		var rootPath = this.root;
		if (fragment === '' || fragment.charAt(0) === '?') {
			rootPath = rootPath.slice(0, -1) || '/';
		}
		var url = rootPath + fragment;

		// Strip the fragment of the query and hash for matching.
		fragment = fragment.replace(pathStripper, '');

		// Decode for matching.
		var decodedFragment = this.decodeFragment(fragment);

		if (this.fragment === decodedFragment) return;
		this.fragment = decodedFragment;

		// If pushState is available, we use it to set the fragment as a real URL.
		if (this._usePushState) {
			this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

			// If hash changes haven't been explicitly disabled, update the hash
			// fragment to store history.
		} else if (this._wantsHashChange) {
			this._updateHash(this.location, fragment, options.replace);
			if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
				var iWindow = this.iframe.contentWindow;

				// Opening and closing the iframe tricks IE7 and earlier to push a
				// history entry on hash-tag change.  When replace is true, we don't
				// want this.
				if (!options.replace) {
					iWindow.document.open();
					iWindow.document.close();
				}

				this._updateHash(iWindow.location, fragment, options.replace);
			}

			// If you've told us that you explicitly don't want fallback hashchange-
			// based history, then `navigate` becomes a page refresh.
		} else {
			return this.location.assign(url);
		}
		if (options.trigger) return this.loadUrl(fragment);
	},

	// Update the hash location, either replacing the current entry, or adding
	// a new one to the browser history.
	_updateHash: function(location, fragment, replace) {
		if (replace) {
			var href = location.href.replace(/(javascript:|#).*$/, '');
			location.replace(href + '#' + fragment);
		} else {
			// Some browsers require that `hash` contains a leading #.
			location.hash = '#' + fragment;
		}
	}

});

// Create the default Backbone.history.
Backbone.history = new History;

// Backbone.View
// -------------

// Backbone Views are almost more convention than they are actual code. A View
// is simply a JavaScript object that represents a logical chunk of UI in the
// DOM. This might be a single item, an entire list, a sidebar or panel, or
// even the surrounding frame which wraps your whole app. Defining a chunk of
// UI as a **View** allows you to define your DOM events declaratively, without
// having to worry about render order ... and makes it easy for the view to
// react to specific changes in the state of your models.

// Creating a Backbone.View creates its initial element outside of the DOM,
// if an existing element is not provided...
var View = Backbone.View = function(options) {
	this.preinitialize.apply(this, arguments);
	//Object.assign(this, _.pick(options, viewOptions));
	this.model = options.model;
	this.el = options.el || 'div';
	this.tagName = 'div';
	this._ensureElement();
	this.initialize.apply(this, arguments);
};

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// List of view options to be set as properties.
var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

// Set up all inheritable **Backbone.View** properties and methods.
Object.assign(View.prototype, Events, {

	// The default `tagName` of a View's element is `"div"`.
	tagName: 'div',

	// jQuery delegate for element lookup, scoped to DOM elements within the
	// current view. This should be preferred to global lookups where possible.
	$: function(selector) {
		return this.$el.find(selector);
	},

	// preinitialize is an empty function by default. You can override it with a function
	// or object.  preinitialize will run before any instantiation logic is run in the View
	preinitialize: function(){},

	// Initialize is an empty function by default. Override it with your own
	// initialization logic.
	initialize: function(){},

	// **render** is the core function that your view should override, in order
	// to populate its element (`this.el`), with the appropriate HTML. The
	// convention is for **render** to always return `this`.
	render: function() {
		return this;
	},

	// Remove this view by taking the element out of the DOM, and removing any
	// applicable Backbone.Events listeners.
	remove: function() {
		this._removeElement();
		this.stopListening();
		return this;
	},

	// Remove this view's element from the document and all event listeners
	// attached to it. Exposed for subclasses using an alternative DOM
	// manipulation API.
	_removeElement: function() {
		this.$el.remove();
	},

	// Change the view's element (`this.el` property) and re-delegate the
	// view's events on the new element.
	setElement: function(element) {
		this.undelegateEvents();
		this._setElement(element);
		this.delegateEvents();
		return this;
	},

	// Creates the `this.el` and `this.$el` references for this view using the
	// given `el`. `el` can be a CSS selector or an HTML string, a jQuery
	// context or an element. Subclasses can override this to utilize an
	// alternative DOM manipulation API and are only required to set the
	// `this.el` property.
	_setElement: function(el) {
		// FIX FIX FIX
		this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
		this.el = this.$el[0];
	},

	// Set callbacks, where `this.events` is a hash of
	//
	// *{"event selector": "callback"}*
	//
	//     {
	//       'mousedown .title':  'edit',
	//       'click .button':     'save',
	//       'click .open':       function(e) { ... }
	//     }
	//
	// pairs. Callbacks will be bound to the view, with `this` set properly.
	// Uses event delegation for efficiency.
	// Omitting the selector binds the event to `this.el`.
	delegateEvents: function(events) {
		events || (events = this.events);
		if (!events) return this;
		this.undelegateEvents();
		for (var key in events) {
			var method = events[key];
			if (typeof method != 'function') method = this[method];
			if (!method) continue;
			var match = key.match(delegateEventSplitter);
			this.delegate(match[1], match[2], method.bind(this));
		}
		return this;
	},

	// Add a single event listener to the view's element (or a child element
	// using `selector`). This only works for delegate-able events: not `focus`,
	// `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
	delegate: function(eventName, selector, listener) {
		this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
		return this;
	},

	// Clears all callbacks previously bound to the view by `delegateEvents`.
	// You usually don't need to use this, but may wish to if you have multiple
	// Backbone views attached to the same DOM element.
	undelegateEvents: function() {
		if (this.$el) this.$el.off('.delegateEvents' + this.cid);
		return this;
	},

	// A finer-grained `undelegateEvents` for removing a single delegated event.
	// `selector` and `listener` are both optional.
	undelegate: function(eventName, selector, listener) {
		this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
		return this;
	},

	// Produces a DOM element to be assigned to your view. Exposed for
	// subclasses using an alternative DOM manipulation API.
	_createElement: function(tagName) {
		return document.createElement(tagName);
	},

	// Ensure that the View has a DOM element to render into.
	// If `this.el` is a string, pass it through `$()`, take the first
	// matching element, and re-assign it to `el`. Otherwise, create
	// an element from the `id`, `className` and `tagName` properties.
	_ensureElement: function() {
		if (!this.el) {
			var attrs = Object.assign({}, this.attributes);
			if (this.id) attrs.id = this.id;
			if (this.className) attrs['class'] = this.className;
			this.setElement(this._createElement(this.tagName));
			this._setAttributes(attrs);
		} else {
			this.setElement(this.el);
		}
	},

	// Set attributes from a hash on this view's element.  Exposed for
	// subclasses using an alternative DOM manipulation API.
	_setAttributes: function(attributes) {
		this.$el.attr(attributes);
	}

});

// Helpers
// -------

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps, staticProps) {
	var parent = this;
	var child;

	// The constructor function for the new subclass is either defined by you
	// (the "constructor" property in your `extend` definition), or defaulted
	// by us to simply call the parent constructor.
	if (protoProps && protoProps.hasOwnProperty('constructor')) {
		child = protoProps.constructor;
	} else {
		child = function(){ return parent.apply(this, arguments); };
	}

	// Add static properties to the constructor function, if supplied.
	Object.assign(child, parent, staticProps);

	// Set the prototype chain to inherit from `parent`, without calling
	// `parent`'s constructor function and add the prototype properties.
	child.prototype = Object.assign(Object.create(parent.prototype), protoProps);
	child.prototype.constructor = child;

	// Set a convenience property in case the parent's prototype is needed
	// later.
	child.__super__ = parent.prototype;

	return child;
};

Router.extend = View.extend = History.extend = extend;
Backbone.Router = Router;
Backbone.View = View;
Backbone.History = History;
Backbone.$ = require('jquery');

module.exports = Backbone;
