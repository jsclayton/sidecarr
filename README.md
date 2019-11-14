## `docker-compose.override.yml` example:

```
version: '3.4'

services:

  web:
    command: -r dotenv/config src/server --config /config
    volumes:
      - ./data:/config
    environment:
      - TZ=America/Denver
```