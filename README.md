This is my successful attempt to intercept instagram mobile app networking.

1. Instagram have it's own networking lib and they dgaf about device certs
This mean it's basically impossible to read SSL encrypted networking.
2. All my attempts to ease the APK with aapt and other tools haven't succeeded -_-
3. Here comes the frida

Facebook uses it's own close-source Tibon http library for all of it requests

I run Frida's with .js script and log the headers

