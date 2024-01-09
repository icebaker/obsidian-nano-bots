# Nano Bots for Obsidian

[Nano Bots](https://spec.nbots.io): AI-powered bots that can be easily shared as a single file, designed to support multiple providers such as [Cohere Command](https://cohere.com), [Google Gemini](https://deepmind.google/technologies/gemini), [Maritaca AI MariTalk](https://www.maritaca.ai), [Mistral AI](https://mistral.ai), [Ollama](https://ollama.ai), [OpenAI ChatGPT](https://openai.com/chatgpt), and others, with support for calling tools (functions).

Enhance your productivity and workflow by bringing the power of Artificial Intelligence to your writing app!

![Nano Bots](https://raw.githubusercontent.com/icebaker/assets/main/obsidian-nano-bots/obsidian-cover.png)

- [Installation](#installation)
  - [Setup](#setup)
    - [Local API Instance](#local-api-instance)
- [Commands](#commands)
  - [Evaluate](#evaluate)
  - [Apply](#apply)
  - [Prompt](#prompt)
  - [Stop](#stop)
- [Cartridges](#cartridges)
  - [Default](#default)
- [Shortcuts](#shortcuts)
  - [Suggested Defaults](#suggested-defaults)
- [Privacy and Security: Frequently Asked Questions](#privacy-and-security-frequently-asked-questions)
  - [Will my files/code/content be shared or uploaded to third-party services?](#will-my-filescodecontent-be-shared-or-uploaded-to-third-party-services)
  - [What information may be shared with third-party AI providers?](#what-information-may-be-shared-with-third-party-ai-providers)
  - [Who are these third parties?](#who-are-these-third-parties)
  - [Is there an option to avoid sharing any information?](#is-there-an-option-to-avoid-sharing-any-information)
  - [Can I use this for private or confidential content/code?](#can-i-use-this-for-private-or-confidential-contentcode)
  - [Do I need to pay to use this?](#do-i-need-to-pay-to-use-this)
  - [Is this project affiliated with OpenAI?](#is-this-project-affiliated-with-openai)
  - [Warranty and Disclaimer](#warranty-and-disclaimer)
- [Development](#development)

https://gist.github.com/assets/113217272/466b4a9e-a511-4c76-a3c2-e16c75622de6

## Installation

Create a folder `obsidian-nano-bots` in your `.obsidian/plugins/` directory inside your vault:

```sh
mkdir -p .obsidian/plugins/obsidian-nano-bots
```

Download the files `manifest.json`, `main.js`, and `styles.css` from the [latest release](https://github.com/icebaker/obsidian-nano-bots/releases) and place them inside the `obsidian-nano-bots` folder.

Ensure that you have "Community Plugins" enabled in your Settings and restart Obsidian.

After restarting, go to "Settings" -> "Community Plugins," find "Nano Bots," and enable it. Once enabled, you can start using it by opening your command palette and searching for "Nano Bots."
### Setup

By default, access to the public Nano Bots API is available. However, it only provides a default Cartridge and may sometimes be slow or unavailable due to rate limits. This is common when many users around the world intensely use the API simultaneously.

To obtain the best performance and the opportunity to develop and personalize your own Cartridges, it is recommended that you use your own provider credentials to run your instance of the API locally. This approach will provide a superior and customized experience, in contrast to the convenient yet limited experience provided by the public API.
#### Local API Instance

To connect your plugin to your own local Nano Bots API, start a local instance using [nano-bots-api](https://github.com/icebaker/nano-bots-api). Please note that the local API still relies on external providers, which has its own policies regarding security and privacy. However, if you choose to use [Ollama](https://ollama.ai) with open source Models, you can ensure that everything is kept local and remains completely private.

Once you have access to the Nano Bots API, you can go to "Settings" -> "Community Plugins" -> "Nano Bots" and add the API Address, which usually is http://localhost:3048:

![Nano Bots Settings](https://raw.githubusercontent.com/icebaker/assets/main/obsidian-nano-bots/settings.png)
## Commands

After installation, you will have the following commands available in the command pallet:

- Nano Bots: [Evaluate](#evaluate)
- Nano Bots: [Apply](#apply)
- Nano Bots: [Prompt](#prompt)
- Nano Bots: [Stop](#stop)

### Evaluate

The Evaluate command sends your currently selected text to a Nano Bot without any additional instructions.

Example:
```text
Selected Text: Hi!

     Nano Bot: Hello! How can I assist you today?
```

Demonstration:

https://gist.github.com/assets/113217272/466b4a9e-a511-4c76-a3c2-e16c75622de6

### Apply

The Apply command works on a text selection. You select a piece of text and ask the Nano Bot to perform an action.

Example:

```text
Selected Text: How are you doing?
       Prompt: translate to french

     Nano Bot: Comment allez-vous ?
```

### Prompt

The Prompt command works like a traditional chat, allowing you to prompt a request and receive an answer from the Nano Bot.

Example:

```
  Prompt: write a hello world in Ruby

Nano Bot: puts "Hello, world!"
```

### Stop

To interrupt a streaming response or stop waiting for a complete response, you can use the "Stop" command in the command palette. This is useful if you realize that the bot's answer is not what you were expecting from your request.

## Cartridges

When executing the commands mentioned earlier, a prompt will appear asking you to select a Cartridge. The default Cartridge is the standard chat interaction. However, you can create your own Cartridges which will automatically appear in the command palette.

For further details on Cartridges, please refer to the [Nano Bots specification](https://spec.nbots.io/#/README?id=cartridges).

### Default

You can override the default cartridge by creating your own with the name `default.yml`:

```yaml
---
meta:
  symbol: 🤖
  name: Default
  author: Your Name
  version: 1.0.0
  license: CC0-1.0
  description: A helpful assistant.

provider:
  id: openai
  credentials:
    address: ENV/OPENAI_API_ADDRESS
    access-token: ENV/OPENAI_API_KEY
  settings:
    user: ENV/NANO_BOTS_END_USER
    model: gpt-3.5-turbo
```

## Shortcuts

There are no default shortcuts, but you can add your own by going to "Settings" -> "Hotkeys" and searching for "Nano Bots"

### Suggested Defaults

These are recommented shortcuts that you may choose do add:

- `ctrl+b` -> `Nano Bots: Evaluate`

Note that you need to disable the default "Toggle bold" hotkey to use this.

Another option is to use _Chord_ Hotkeys, which you can do with plugins like [Sequence Hotkeys](https://obsidian.md/plugins?id=obsidian-sequence-hotkeys):

- `ctrl+b` `ctrl+b` -> `Nano Bots: Evaluate`
- `ctrl+b` `ctrl+l` -> `Nano Bots: Apply`
- `ctrl+b` `ctrl+p` -> `Nano Bots: Prompt`
- `ctrl+b` `ctrl+k` -> `Nano Bots: Stop`

Note that you would also need to disable the default "Toggle Bold" hotkey to use this.

## Privacy and Security: Frequently Asked Questions

### Will my files/code/content be shared or uploaded to third-party services?

Absolutely not, unless you intentionally take action to do so. The files you're working on or have open in your writing app will never be uploaded or shared without your explicit action.

### What information may be shared with third-party AI providers?

Only small fragments of text/code that you intentionally take action to share. The specific text you select while using the [Evaluate](#evaluate) command is shared with the [Nano Bots Public API](https://api.nbots.io), which also needs to share it with the [OpenAI API](https://platform.openai.com/docs/api-reference) strictly for generating a response. If you choose to use your own Local API, it will depend on your choice of providers and configurations.

### Who are these third parties?

The data you deliberately choose to share will be transmitted securely (HTTPS) to the [Nano Bots Public API](https://api.nbots.io). This public API is open source and available for auditing [here](https://github.com/icebaker/nano-bots-api). It employs [OpenAI API](https://platform.openai.com/docs/api-reference) for data processing. As a result, any data you opt to share will also be sent to OpenAI API, which according to [their policies](https://openai.com/policies/api-data-usage-policies), is not used for model training and is not retained beyond a 30-day period.

### Is there an option to avoid sharing any information?

Sharing fragments of data is necessary to generate outputs. You have the option to use your own [local instance](#local-api-instance) of the [Nano Bots API](https://github.com/icebaker/nano-bots-api). This setup ensures all interactions occur locally on your machine, with the only data shared being with your personal [OpenAI API](https://platform.openai.com). Alternatively, you can decide not to use OpenAI as well, and instead, connect the local Nano Bots API to your own local LLM, such as [Ollama](https://ollama.ai), enabling a completely local and private interaction.

### Can I use this for private or confidential content/code?

For private or confidential content/code, we recommend that you or your organization conduct a thorough security and privacy assessment. Based on this, you may decide that the [Nano Bots Public API](https://github.com/icebaker/nano-bots-api) and [OpenAI's privacy policies](https://openai.com/policies/api-data-usage-policies) are sufficient, or you may choose to use your own [private setup](#local-api-instance) for the API and LLM provider.

### Do I need to pay to use this?

No. If you're using the default [Nano Bots Public API](https://api.nbots.io), there's no cost involved, but you might encounter occasional rate limiting or stability issues. If you decide to use your own API and LLM provider, any associated costs will depend on your chosen provider. For instance, using the Nano Bots API locally with OpenAI will require a paid [OpenAI Platform Account](https://platform.openai.com).

### Is this project affiliated with OpenAI?

No, this is an open-source project with no formal affiliations with OpenAI or any of the other supported providers. It's designed for compatibility with various LLM providers, with OpenAI being the default one. As OpenAI is a private company, we can't provide any assurances about their services, and we have no affiliations whatsoever. Use at your own risk.

### Warranty and Disclaimer

This project follows the [MIT license](https://opensource.org/license/mit/). In plain language, it means:

> The software is provided as it is. This means there's no guarantee or warranty for it. This includes how well it works (if it works as you expect), if it's fit for your purpose, and that it won't harm anything (non-infringement). The people who made or own this software can't be held responsible if something goes wrong because of the software, whether you're using it, changing it, or anything else you're doing with it.

In other words, there's no promise or responsibility from us about what happens when you use it. So, it's important that you use it at your own risk and decide how much you trust it. You are the one in charge and responsible for how you use it and the possible consequences of its usage.

## Development

```sh
npm install

npm run dev
npm run build
```

For more details, refer to the Obsidian documentation:
- https://github.com/obsidianmd/obsidian-api

Releasing new releases:

- Update the `manifest.json` with the new version number, such as `1.0.1`, and the minimum Obsidian version required for the latest release.
- Update the `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of the plugin that's compatible.
- Create new GitHub release using the new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of the repository and also in the release.
- Publish the release.
