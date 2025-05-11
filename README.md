# Ai-Generate_Games

Here is the deployed app: https://ai-generate-games.onrender.com/

The following app was built in the context of a hackathon. The prompt asked for the creation of an app which could generate novel games based on text input to an LLM.
I used OpenAi's API for my project.

State of AI text to game generation:
As of May 11th 2025, if you ask chat gpt to produce an html/css/JS game from scratch using a desciption (e.g. make me a game of a princess fighting a dragon) it will generate something useless. Often times the controls are weird and the produced code hardly relates to the prompt. 

My solution:
In short, scaffolding. Instead of simply querying "make the princess fight the dragon", did so by passing a fully functional, albeit simple, html/css/JS game to the API. This allowed the AI to to latch onto deliniated game logic, and import features of the games related to the prompt. ChatGpt was at first quite obstinate, and was hardly able to generate something dissimilar to the template I provided. That is until I introduced emojis. Emojis are classified in natrual langauge, as in each emoji has a corresponding title attached to it. Thus, it was easy for ChatGpt to interchange features of the game when emojis were involved.

My app allows the user to use four game templates along with their query and pretty reliably their concept comes to fruition. To me this is a proof of concept that if one has the right input and proper scaffold that an LLM can produce any game... or rather..will be able to in the future ( maybe distant. Unclear)

To me this game is a demonstation that one day the imagination of the user will dynamically produce games. 

Thanks for reading

Email: jkobygold@gmail.com
