#!/usr/bin/env sh

trap INT
exec `echo "$@"` | pino-pretty -c -t "SYS:yyyy-mm-dd HH:MM:ss" -i pid,hostname
