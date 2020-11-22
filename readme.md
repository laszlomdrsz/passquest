# Description

PassQuest project for Jasmin Lucky Wheel Hackathon. A fun game where you can play by sharing your progress with friends and taking turns to complete procedurally generated maps. You have an extra challange: switching weapons works with voice commands you can give names to the weapons, but you share the weapon names with your friends, along with your progression. Don't forget to tell them the names you gave!

## Why we think it's the best project

- We use 6 Web APIs in a relevant way:
- Maps are procedurally generated and your whole progression can be shared with a single short link. Your cooperate with your friends and continue go through the progression together, on the same maps, using the same items, still completely serverless.
- Web Speech API is used for giving names for weapons. You need to say their names out to use them! It's not a problem if Web Speech API cannot recognize the word letter by letter. We use Web Worker API to give the closest match to your command.
- Sharing is a core feature to the game. We use Navigation.share() to make the process quick and easy. We also leveraged Clipboard API to make the game accessible for PC or saving your result for yourself.
- A core concept of the game is playing with words: you need to share weapon names with your friends so they can also use them.
- You can control the game by tilting the phone, or using WASD keys on PC. You can change weapons by tapping on the current weapon.
- The map is generated using Canvas API.
- We actually provide a very simple and easy version of the game, but gameplay is easily extendable by modifying a few variables, which have a great impact on the structure of the maps, difficulty, weapons, characters and enemy stats. Everything is procedurally generated and maps can be as huge as you want!

Required APIs used for gameplay:

- Web Worker API
- Web Speech API
- Navigation.share()

Optional APIs used for gameplay:

- Canvas API
- Clipboard API
- DeviceOrientation

## Running the project

There is nothing special required, you only need to open index.html on a (virtual) web host.

## Working link

https://illuzioknelkul.nfshost.com/

## Requirements

Latest Chrome browser on an Android device or desktop. Works on PC by using WASD keys.

## Video link
https://www.youtube.com/watch?v=8IJoR8jQYQk&feature=share
```

