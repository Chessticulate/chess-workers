#!/usr/bin/bash

VERSION=$(jq -r '.version' package.json)

echo "$VERSION"

