# Sidecarr

<div align="center">
	<img alt="Sidecarr" height="150" src=".github/img/logo.png" width="150" />
</div>

Sidecarr lives alongside your Plex Media Server and automation tools to help curate your media collection.

- Integrates with [Radarr](https://radarr.video/), [Sonarr](https://sonarr.tv/), and [Lidarr](https://lidarr.audio/)
- Trigger Plex scans only on directories with changes
- Post playback notifications to Slack

## Docker Compose Quick Start

```
version: '3.4'

services:

  sidecarr:
    image: ghcr.io/jsclayton/sidecarr:latest
    environment:
      SIDECARR_BASE_URL: 'https://sidecarr.myflix.com'
      SIDECARR_PMS_BASE_URL: 'http://plex:32400'
      SIDECARR_PMS_TOKEN: '{YOUR PLEX TOKEN}'
      SIDECARR_SLACK_WEBHOOK_URL: '{YOUR SLACK WEBHOOK URL}'
```

| Environment Variable | Description |
| --- | --- |
| `SIDECARR_BASE_URL` | The publicly accessible URL where Sidecarr can be reached at. This is used by Slack to access thumbnail images. Not needed if you don't configure Slack notification. |
| `SIDECARR_PMS_BASE_URL` | The URL that your PMS can be reached at, relative to the Sidecarr instance. If you are running PMS within the same Docker instance you can use the container name to access it. |
| `SIDECARR_PMS_TOKEN` | [Your PMS token.](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/) |
| `SIDECARR_SLACK_WEBHOOK_URL` | [Your Slack webhook URL.](https://api.slack.com/messaging/webhooks) |