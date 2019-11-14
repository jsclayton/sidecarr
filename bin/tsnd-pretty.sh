#!/usr/bin/env sh

exec tsnd "$@" | pino-pretty -c -t "SYS:yyyy-mm-dd HH:MM:ss" -i pid,hostname