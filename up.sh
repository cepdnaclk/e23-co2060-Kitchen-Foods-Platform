#!/usr/bin/env bash
# Start the DB container, then run every one-shot JS script against it via the
# seed service. Add scripts to the SCRIPTS array to run them automatically.
# Backend/frontend run on the host (npm run dev), so only postgres is started here.
set -euo pipefail

# Scripts are run in order from the backend image (any file under backend/ works).
SCRIPTS=(
  insert-test-users.js
  test_status.js
)

docker compose up -d postgres

for script in "${SCRIPTS[@]}"; do
  echo "== Running $script =="
  docker compose run --rm seed node "$script"
done

echo
echo "Done. Admin login -> admin@test.com / 12345678"