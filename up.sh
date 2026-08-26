#!/usr/bin/env bash
# Start the DB container, then run every one-shot JS script against it via the
# seed service. Add scripts to the SCRIPTS array to run them automatically.
# Backend/frontend run on the host (npm run dev), so only postgres is started here.
set -euo pipefail

# Scripts are run in order from the backend image (any file under backend/ works).
SCRIPTS=(
  insert-test-users.js
  # test_status.js
)

docker compose up -d postgres

# Rebuild the seed image so the JS scripts inside it always match the files
# on disk (otherwise `docker compose run` reuses a stale image).
docker compose build seed

for script in "${SCRIPTS[@]}"; do
  echo "== Running $script =="
  docker compose run --rm seed node "$script"
done

echo
echo "Done. Running the scripts"