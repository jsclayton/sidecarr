#!/usr/bin/env sh

trap exit 0 INT
exec `echo "$@"` | pino-datadog -k $DD_KEY -d $DD_SOURCE -s sidecarr | pino-pretty -c -t "SYS:yyyy-mm-dd HH:MM:ss" -i pid,hostname
