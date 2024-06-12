# Discord Bot - Voice Channel Management

This project is a Discord bot designed to manage voice channels and enforce certain behaviors in a Discord server. It leverages the `discord.js` library and uses environment variables for configuration. Below is a brief overview of the bot's functionality.

## Features

1. **Command Handling**:
    - The bot listens for the `!chamada` command in text channels.
    - When the command is issued, it checks if a cooldown period has passed since the last execution (15 minutes).
    - If the command is executed successfully, it prompts users in the voice channel to react within 20 seconds.
    - Users who do not react are moved to the server's AFK channel.

2. **Voice Channel Monitoring**:
    - The bot monitors voice channel state updates.
    - If a specific user joins a voice channel, it will disconnect another specified user from the channel.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- `discord.js` library
- `dotenv` library

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
