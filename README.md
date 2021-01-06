# Chat App

Time elaspsed: ~4 hours

Completed:
 - chat app that allows users to communicate with each other
 - backend uses sockets to broadcast messages (surprisingly pretty slow)
 - stores all chats within redis respective to their channels
 - frontend allows channels to be selected and retrieves the respective logs
Missing:
 - TESTS!! There was unfortunetly not enough time to write tests :(

## Why I chose what I did to work on

For the most part, I just got the base app to work (chat app) on the backend and front end but also wanted to throw in channels since I feel the channels feature adds flavour to the app, making it feel less hallow - if that even makes sense. But that is just an opinion I have.

## Possible next steps

The obvious next step is **tests**, there are none! Aside from that, the login is very basic (just entering in a username isn't the most secure thing in the word) and the number of channels is static. A user should be able to create channel and not just channels but be able to send messages directly to other users (private messages). Lastly the thing I would want to work on is making it looker nicer. I ported in the material ui library but wasn't able to make much use of it. Without implementing my own design library and using what material ui offers, I should be able to make the app look a lot nicer without much effort.

## client:

Node version: v15.2.1
```
yarn install // install packages
yarn start // start server on port 3000
```


## server:

Python version: Python 3.9.1
Uses redis as the database (`brew install redis && redis-server --daemonize yes`)

```
pip install -r requirements.txt # install depedencies
source venv/bin/activate # optional
python app.py
```
