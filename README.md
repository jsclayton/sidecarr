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

## TypeScript Nuances

[https://stackoverflow.com/a/61305579/30826](https://stackoverflow.com/a/61305579/30826)
