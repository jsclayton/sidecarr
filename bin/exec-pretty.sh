#!/usr/bin/env sh

exec `echo "$@"` | pino-pretty -c -t "SYS:yyyy-mm-dd HH:MM:ss" -i pid,hostname
