# Build Scripts

Image optimization tooling (`optimize-images.mjs` and related npm scripts/dependencies) was removed to simplify installation and avoid native dependency issues on macOS. No build-time image transformations are currently performed.

If image optimization is reintroduced in the future, prefer a purely JS/WASM solution or perform optimization in CI/CD rather than as a local install prerequisite.

