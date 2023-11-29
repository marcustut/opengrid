SHELL := /bin/bash

include .env
export

# Connect to the db using pgcli
pgcli:
	pgcli $(DATABASE_URL)

