# Discord DM Watcher

Monitors incoming Discord DMs and sends push notifications.

## Stack

- [Bun v1.2.4](https://bun.sh)
- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)
- [ntfy](https://ntfy.sh)

## Usage

To install dependencies:

```sh
bun install
```

Create `.env` file with the following:

```sh
DISCORD_ACCESS_TOKEN=
NTFY_URL=https://ntfy.sh/mytopic
```

- `DISCORD_ACCESS_TOKEN`: follow [these steps](https://github.com/aiko-chan-ai/discord.js-selfbot-v13?tab=readme-ov-file#get-token-) to get your Discord token.
- `NTFY_URL`: replace **mytopic** with your topic.

To run for development:

```sh
bun dev
```

To run for production:

```sh
bun start
```
