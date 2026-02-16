Java.perform(function() {
    console.log("Tigon network loaded");
    
    try {
        var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        TrustManagerImpl.verifyChain.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
            return untrustedChain;
        };
    } catch(e) {}

    setTimeout(function() {
        try {
            var TigonRequest = Java.use('com.facebook.tigon.iface.TigonRequest');
            TigonRequest.url.implementation = function() {
                var url = this.url();
                console.log("\n" + "=".repeat(80));
                console.log("TIGON REQUEST");
                console.log("=".repeat(80));
                console.log("URL: " + url);
                return url;
            };
            TigonRequest.headers.implementation = function() {
                var headers = this.headers();
                console.log("\nRequest Headers:");
                try {
                    var headerNames = headers.getNames();
                    var iterator = headerNames.iterator();
                    while (iterator.hasNext()) {
                        var name = iterator.next();
                        var values = headers.get(name);
                        var valIterator = values.iterator();
                        while (valIterator.hasNext()) {
                            console.log("  " + name + ": " + valIterator.next());
                        }
                    }
                } catch(e) {
                    console.log("  (Could not parse headers: " + e + ")");
                }
                return headers;
            };
            TigonRequest.method.implementation = function() {
                var method = this.method();
                console.log("Method: " + method);
                return method;
            };
            console.log("TigonRequest hooks installed");
        } catch(e) {
            console.log("TigonRequest hook failed: " + e);
        }
    }, 1000);
    setTimeout(function() {
        try {
            var TigonRequestBuilder = Java.use('com.facebook.tigon.iface.TigonRequestBuilder');
            TigonRequestBuilder.build.implementation = function() {
                var request = this.build();
                console.log("\n" + "=".repeat(80));
                console.log("TIGON REQUEST BUILT");
                console.log("=".repeat(80));
                try {
                    console.log("URL: " + request.url());
                    console.log("Method: " + request.method());
                    
                    var headers = request.headers();
                    console.log("\nHeaders:");
                    var headerNames = headers.getNames();
                    var iterator = headerNames.iterator();
                    while (iterator.hasNext()) {
                        var name = iterator.next();
                        var values = headers.get(name);
                        var valIterator = values.iterator();
                        while (valIterator.hasNext()) {
                            console.log("  " + name + ": " + valIterator.next());
                        }
                    }
                } catch(e) {
                    console.log("Error reading request details: " + e);
                }
                
                return request;
            };
            
            TigonRequestBuilder.addHeader.overload('java.lang.String', 'java.lang.String').implementation = function(name, value) {
                console.log("[HEADER ADDED] " + name + ": " + value);
                return this.addHeader(name, value);
            };
            
            console.log("TigonRequestBuilder hooks installed");
        } catch(e) {
            console.log("TigonRequestBuilder hook failed: " + e);
        }
    }, 1500);

    setTimeout(function() {
        try {
            var TigonRequestSucceeded = Java.use('com.facebook.tigon.tigonobserver.interfaces.TigonRequestSucceeded');
            
            Java.choose('com.facebook.tigon.tigonobserver.interfaces.TigonRequestSucceeded', {
                onMatch: function(instance) {
                    console.log("Found TigonRequestSucceeded instance");
                },
                onComplete: function() {}
            });
            
            console.log("TigonRequestSucceeded enumerated");
        } catch(e) {
            console.log("TigonRequestSucceeded hook failed: " + e);
        }
    }, 2000);

    setTimeout(function() {
        try {
            var TigonRequestBuilder = Java.use('com.facebook.tigon.iface.TigonRequestBuilder');
            
            var methods = TigonRequestBuilder.class.getDeclaredMethods();
            for (var i = 0; i < methods.length; i++) {
                var methodName = methods[i].getName();
                if (methodName.toLowerCase().indexOf('body') !== -1) {
                    console.log("Found body method: " + methodName);
                }
            }
        } catch(e) {
            console.log("Body method enumeration failed: " + e);
        }
    }, 2500);

    setTimeout(function() {
        try {
            var BufferedOutputStream = Java.use("java.io.BufferedOutputStream");
            
            BufferedOutputStream.write.overload('[B', 'int', 'int').implementation = function(buffer, offset, length) {
                if (length > 0 && length < 50000) {
                    try {
                        var data = Java.use("java.lang.String").$new(
                            Java.array('byte', buffer.slice(offset, offset + length))
                        );
                        
                        if (data.indexOf('HTTP') !== -1 || 
                            data.indexOf('Content-') !== -1 || 
                            data.indexOf('User-Agent') !== -1 ||
                            data.indexOf('POST') !== -1 ||
                            data.indexOf('GET') !== -1) {
                            console.log("\n[RAW HTTP DATA]:");
                            console.log(data);
                        }
                    } catch(e) {}
                }
                return this.write(buffer, offset, length);
            };
            
            console.log("BufferedOutputStream installed");
        } catch(e) {
            console.log("BufferedOutputStream failed: " + e);
        }
    }, 3000);
});
