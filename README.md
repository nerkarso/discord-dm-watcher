<p align="center">
  <img src=".github/assets/icon.png" width="96" alt="Icon" />
</p>

<h1 align="center">Discord DM Watcher</h1>

<p align="center">Monitors incoming Discord DMs and sends push notifications.</p>

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

| Variable                     | Description                                                                                                                                         | Default Value                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `DISCORD_ACCESS_TOKEN`       | **Required**. Follow [these steps](https://github.com/aiko-chan-ai/discord.js-selfbot-v13?tab=readme-ov-file#get-token-) to get your Discord token. |                                                               |
| `NTFY_URL`                   | **Required**. Replace with your URL (e.g., `https://ntfy.sh/my-topic`).                                                                             |                                                               |
| `NTFY_ICON`                  | You can include an icon that will appear next to the text of the notification                                                                       | `https://img.icons8.com/?size=192&id=M725CLW4L7wE&format=png` |
| `CLIENT_RATE_LIMIT_DURATION` | The time window in seconds in which push notifications, based on conditions by the client.                                                          | `900`                                                         |
| `SENDER_RATE_LIMIT_DURATION` | The time window in seconds in which push notifications, based on conditions by the sender.                                                          | `900`                                                         |
| `PORT`                       | The port on which the server is running.                                                                                                            | `5000`                                                        |

To run for development:

```sh
bun dev
```

To run for production:

```sh
bun start
```
