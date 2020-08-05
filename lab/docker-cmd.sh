#!/usr/bin/env bash
set -e

jupyter lab --ip 0.0.0.0 --port 80 --allow-root --NotebookApp.token="" --NotebookApp.password="" --LabApp.base_url="/_lab-instance/$LAB_ID"
