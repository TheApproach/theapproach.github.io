# Approach Docs Build Script
# Small but useful script to build the project and start a server

if [ ! -d "node_modules" ]; then
  echo "node_modules not found, running npm install"
  npm install
fi
if [ -d "dist" ]; then
  echo "dist folder found, removing it"
  rm -rf dist
fi
npm run build
if [ -d "dist" ]; then
  echo "dist folder found, starting server"
  python3 -m http.server 8000 -d dist
else
  echo "dist folder not found, build failed"
fi
