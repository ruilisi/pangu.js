#/bin/sh
VER=59
mkdir node_modules/node-sass/vendor/darwin-x64-$VER/
wget https://github.com/sass/node-sass/releases/download/v4.12.0/darwin-x64-${VER}_binding.node -O node_modules/node-sass/vendor/darwin-x64-$VER/binding.node

