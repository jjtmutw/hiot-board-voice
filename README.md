# HIoT Board Voice

HIoT laboratory electronic notice board with MQTT status updates, marquee messages, voice notes, URL-based board configuration, fullscreen startup behavior, and PWA install support.

## Usage

Open the board page with optional URL parameters:

```text
board_voice.html?user=pjj&board=board2
```

When no parameters are provided, the default board is:

```text
user=pjj
board=board1
```

The MQTT base topic is generated as:

```text
JJ/{user}/{board}
```

## PWA

Serve this folder through `localhost`, HTTP, or HTTPS to enable PWA installation and service worker caching. Opening the HTML directly through `file://` will not enable service worker features in most browsers.
