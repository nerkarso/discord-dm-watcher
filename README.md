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

| Variable               | Description                                                                                                                                         | Default Value                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `DISCORD_ACCESS_TOKEN` | **Required**. Follow [these steps](https://github.com/aiko-chan-ai/discord.js-selfbot-v13?tab=readme-ov-file#get-token-) to get your Discord token. |                                                               |
| `NTFY_URL`             | **Required**. Replace with your URL (e.g., `https://ntfy.sh/mytopic`).                                                                              |                                                               |
| `NTFY_ICON`            | You can include an icon that will appear next to the text of the notification                                                                       | `https://img.icons8.com/?size=192&id=M725CLW4L7wE&format=png` |
| `RATE_LIMIT_DURATION`  | The time window in seconds in which push notifications are sent.                                                                                    | `900`                                                         |

To run for development:

```sh
bun dev
```

To run for production:

```sh
bun start
```
