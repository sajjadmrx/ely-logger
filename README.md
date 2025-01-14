
# ely-logger


ely-logger is a simple and lightweight logging library for Node.js that allows you to send logs to Discord, Telegram, and other services with just one line of code. It supports multiple emitters, including the console, file, Discord, Telegram, and more. It's easy to use and can be integrated into any Node.js project with minimal effort.

## Installation
Use the package manager of your choice to install the package:

npm:
```bash
npm install ely-logger
```
yarn:
```bash
yarn add ely-logger
```

## Emitters
- [File](./lib/log/emitters/file.emitter.ts)
- [Telegram](./lib/log/emitters/telegram.emitter.ts)
- [Discord Webhook](./lib/log/emitters/discord.emitter.ts)
- [Console](./lib/log/emitters/console.emitter.ts)
- [Sentry](./lib/log/emitters/sentry.emitter.ts)

## Usage
the package can be used in any JavaScript or TypeScript project. Here are some examples of how to use it in different environments.

> [!NOTE]
> The package is designed to be used with TypeScript, but it can also be used in JavaScript projects.

Nest.js
```typescript
import { Module } from '@nestjs/common';
import { LogModule } from 'ely-logger';

@Module({
    imports: [
       LogModule.forRoot({
            isGlobal: true,
            discordWebhook:  'https://discord.com/api/webhooks/...' // optional
        }),
        // or:
      LogModule.forRootAsync({
			    isGlobal: true,
			    inject: [ConfigService],
		    	useFactory(configService: ConfigService<VariablesType>) {
			    	return {
			    		sentry: {
						    dsn: configService.get('SENTRY_DSN'),
						    environment: configService.get('NODE_ENV'),
						    tracesSampleRate: 1.0,
						    integrations: [Sentry.nestIntegration()],
				    	},
				}
			},
		}),
    ],
  providers: [],
  exports: [],
})
export class AppModule {}

// cats.service.ts

import { Injectable } from '@nestjs/common';
import { LogService } from 'ely-logger';

@Injectable()
export class CatsService {
  constructor(private readonly logger: LogService) {}

    findAll(): string {
        this.logger.log(message).context(CatsService.name).into(Emitter.CONSOLE)
        return 'This action returns all cats';
    }

    findOne(id: number): string {
        this.logger.log(message).context("findOne").into(Emitter.DISCORD)
        return `This action returns a #${id} cat`;
    }
}

```


everywhere else
```typescript
import { LogService, Emitter } from 'ely-logger';

let logger = new LogService('myContext');

// --- OR --- 

logger = new LogService({
  context: 'myContext',
  discordWebhook: 'https://discord.com/api/webhooks/...'
})

logger = new LogService({
  telegram: {
    chatId: '1234567890',
    token: '1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
  },
  context: 'myContext'
})


// Log a message to the console
logger.log('Hello, world!').into(Emitter.CONSOLE);

// Log a warning to Discord
logger.warn('Something might be wrong...').into(Emitter.DISCORD);

// Log an error to Telegram
logger.error('Something went wrong!').into(Emitter.TELEGRAM);
```

## how to use the emitters?
> [!TIP]
> ```ts
>  const logger = new LogService({
>   telegram: {
>     chatId: '1234567890',
>     token: '1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
>   },
>   context: 'myContext'
> })
>```
> you can use the telegram emitter by providing the chatId and the token of your bot.

> [!TIP]
> ```ts
>  const logger = new LogService({
>   discordWebhook: 'https://discord.com/api/webhooks/...',
>   context: 'myContext'
> })
>```
> you can use the discord emitter by providing the webhook url.

> [!TIP]
> ```ts
> const logService = new LogService('TestContext', {
>  file: {
>    path: './logs',
>    includeDateInFilename: true,
>    fileFormat: 'log',
>    messageFormat: 'DATE - LEVEL | CONTEXT | MESSAGE'
>  }
>})
>```
> you can use the file emitter by providing the path of the file, the file format, and the message format.

> [!TIP]
> ```ts
> const logService = new LogService('TestContext', {})
> const logger = new LogService('my-app', {
>  sentry: {
>    dsn: 'https://sentry.io/123456...',
>    tracesSampleRate: 1,
>    environment: 'production',
>    integrations: [Sentry.httpIntegration()],
>  }
>})
>
>   logger
>      .error(
>        buildSentryPayload({
>          contentOrError: error,
>          user: {
>            id: 1
>          },
>          contexts: {
>            myContext: {
>              id: 1,
>              name: 'myContext',
>              type: 'myType',
>              version: '1.0.0'
>            }
>          }
>        })
>      )
>      .into(Emitter.SENTRY)
> //or:
> logger.warn('Something might be wrong...').into(Emitter.SENTRY);
> ```
> you can use the sentry emitter by providing the dsn of your project, the tracesSampleRate, the environment, and the integrations.


## Examples
you can find more examples in the [examples](./examples) directory.

## API

### LogService

The main class of the package. Use it to create a new logger.

#### constructor(context: string | OptionsWithContext)

Creates a new logger. The context can be a string or an object with options.

#### log(...msg: any[])

Logs a message with the level 'INFO'.

#### warn(...msg: any[])

Logs a message with the level 'WARN'.

#### error(...msg: any[])

Logs a message with the level 'ERROR'.

### Message

This class is used internally to create a new message.

#### context(context: string)

Sets the context of the message.

#### is(level: LogLevel)

Sets the level of the message.

#### into(emitter: Emitter)

Sends the message to the specified emitter.

## Emitters

The package supports the following emitters:

- CONSOLE: Logs the message to the console.
- DISCORD: Sends the message to a Discord channel.
- TELEGRAM: Sends the message to a Telegram chat.
- FILE: Logs the message to a file.
- SENTRY: Sends the message to Sentry.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
