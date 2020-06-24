#!/usr/bin/env sh

trap INT
exec `echo "$@"` | pino-datadog -k $DD_KEY -d $DD_SOURCE -s plexbuddy | pino-pretty -c -t "SYS:yyyy-mm-dd HH:MM:ss" -i pid,hostname
