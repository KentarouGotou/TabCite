# TabCite

npm install
git add package.json package-lock.json
git commit -m "Fix vexflow version and add lockfile"

docker build -t tabsite .
docker run --rm -p 5173:5173 -v $(pwd):/app -v /app/node_modules tabsite

## WindowsOS case
-first time
MSYS_NO_PATHCONV=1 docker run --rm -it -p 5173:5173 \
  -e CHOKIDAR_USEPOLLING=true \
  -e WATCHPACK_POLLING=true \
  -e VITE_FS_USE_POLLING=true \
  -v "$(pwd -W):/app" \
  tabsite sh -lc "npm ci || npm install; npm run dev -- --host 0.0.0.0"

-after that
MSYS_NO_PATHCONV=1 docker run --rm -p 5173:5173 \
  -e CHOKIDAR_USEPOLLING=true \
  -e WATCHPACK_POLLING=true \
  -e VITE_FS_USE_POLLING=true \
  -v "$(pwd -W):/app" \
  -v /app/node_modules \
  tabsite