import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { join } from "path";
import { env } from "process";
import { AzureFunctionServer, SlashCreator } from "slash-create";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
};

(async () => {
  const creator = new SlashCreator({
    applicationID: env.BOT_APP_ID,
    publicKey: env.BOT_APP_PUBLIC_KEY,
    token: env.BOT_APP_TOKEN,
  });

  await creator
    // The first argument is required, but rhe second argument is the "target" or the name of the export.
    // By default, the target is "interactions".
    .withServer(new AzureFunctionServer(module.exports))
    .registerCommandsIn(join(__dirname, "commands"));

  // If a guild have been specified, only sync the command with the guild
  if (env.COMMANDS_GUILD_ID)
    creator.syncCommandsIn(env.COMMANDS_GUILD_ID);
  else creator.syncCommands();
})();

export default httpTrigger;