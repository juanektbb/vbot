require('dotenv').config()
const { App } = require('@slack/bolt')
const axios = require('axios')

//Create the bot
const bot = new App({
	signingSecret: process.env.SIGNING_SECRET,
	token: process.env.TOKEN
});

//Initiate the bot
(async () => {
	await bot.start(3000);
	console.log('vBot is running baby!');
})();

//BOT WAS MENTIONED
bot.event("app_mention", async ({context, event}) => {

	const valid_commands = ['joke', 'jokes']

	//Detect what is saved here
	const args = event.text.split(" ")
	const command = args.splice(1,1)[0].toLowerCase()
	const botCode = args.splice(0,1)[0]
	const params = args.join(" ")

	//THE COMMAND IS VALID 
	if (valid_commands.includes(command)){

		if(command == 'joke' || command == 'jokes'){

			//Scrape the page to find the joke
			const wholepage = await axios.get('https://icanhazdadjoke.com/')
			const string_page = wholepage.data
			const crop_one = string_page.split(`<p class="subtitle">`)
			const joke = crop_one[1].split(`</p>`)[0]

			//Try to responde the joke
			try{
				await bot.client.chat.postMessage({
					token: context.botToken,
					channel: event.channel,
					text: `${joke}`
				})
			}catch(e){
				console.log(`Error responding ${e}`)
			}

		}

	//THE COMMAND IS NOT VALID
	}else{
		try{
			await bot.client.chat.postMessage({
				token: context.botToken,
				channel: event.channel,
				text: `Hey <@${event.user}>, that command is not programmed yet`
			})
		}catch(e){
			console.log(`Error responding ${e}`)
		}
	}
	
})