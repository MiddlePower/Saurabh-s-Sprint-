# Ranked practice prototype

This feature branch introduces a **local seeded challenge mode** to the existing
Three.js runner. It is not yet online ranked matchmaking.

## How to try it

1. Run `npm install` and `npm run dev`.
2. Open the game and choose **🏆 RANKED PRACTICE** on the main menu.
3. Enter a seed, such as `2026`. Use the same seed in another browser
   session to generate the same series of obstacles.
4. Survive as far as possible. The run ends on the first crash, without revives.

## Implementation

- `js/ranked-core.js`: pure, seeded chunk obstacle plan generator.
- `js/world.js`: creates only the planned obstacles during seeded runs.
- `js/main.js`: switches between the original solo mode and ranked practice.
- `index.html`: menu button and ranked core script.

### Fairness limitations

This implementation is a *prototype*. It is NOT real ranked multiplayer,
not server-validated, and not cheat-proof. Frame-rate-related physics,
moving game elements and the original engine still need further auditing.
The world renderer is still the original game, while the obstacle patterns
in ranked practice are deterministically generated. The ranking and score
calculation are NOT authoritative.

Before adding online ranked matchmaking:

1. Extract gameplay and collision logic into a deterministic, fixed-tick
   simulation that can run on the server.
2. Generate and validate course layouts on the server.
3. Validate input streams and authoritative results.
4. Add player accounts, a matchmaking queue, and a rating database.
5. Audit all source artwork/assets and retain the upstream MIT license.

## Legal

This work builds on Saurabh's Sprint by Saurabh Shriwastava, MIT licensed.
Keep the upstream `LICENSE` intact. Original Subway Surfers art and
branding are not provided or authorized by this project.
