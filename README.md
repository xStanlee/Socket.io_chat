# Project 1: Chat app                  
## Objectives
    
    Learn to use JavaScript to run code server-side.
    Become more comfortable with building web user interfaces.
    Gain experience with Socket.IO to communicate between clients and servers.
    
## Deploy on Heroku(connected repository to Github):

URL(To heavy app for free version of heroku, working but throwing status=503 for 70-80% of request) : https://chatchatup.herokuapp.com/

    Usage: 
    Go to register page. Make your own account. Log in to the browser part and check for a book. 
    You can use example logs:
    
    login: Example
    password: example12
    
    Start using chat! With functionality private poke messages to users based on sessionID's. 
    
    Alternative:
    Clone repo to your local computer. Make sure you've installed python 3.x'up and pip(package mengaer). In terminal window opened on projects root put a command
    install -r requirements.txt, which allows you to simply install needed packages.
    Also in terminal in main project root(Where's application.py file) set enviroments like DATABASE_URL and name of flask application FLASK_APP. Make sure debug
    mode (FLASK_DEBUG) is set to 1, and now you can use chatApplication.

    Feel free to use that for your own purpouse or learning.
    
# Overview

In this project, you’ll build an online messaging service using Flask, similar in spirit to Slack. Users will be able to sign into your site with a display name,     create channels (i.e. chatrooms) to communicate in, as well as see and join existing channels. Once a channel is selected, users will be able to send and receive messages with one another in real time. Finally, you’ll add a personal touch to your chat application of your choosing!

# Milestones

## We recommend that you try to meet the following milestones:

Complete the Display Name, Poke User, and Connect/Disconnect Users steps.
Complete the Messages View and Sending Messages steps.
Complete the Remembering the Channel and Personal Touch steps.

# Requirements

## Alright, it’s time to actually build your web application! Here are the requirements:

### Display Name: When a user visits your web application for the first time, they should be prompted to type in a display name that will eventually be associated with every message the user sends. If a user closes the page and returns to your app later, the display name should still be remembered.
### Messages View: Once a channel is selected, the user should see any messages that have already been sent in that channel, up to a maximum of 100 messages. Your app should only store the 100 most recent messages per channel in server-side memory.
### Sending Messages: Once in a channel, users should be able to send text messages to others the channel. When a user sends a message, their display name and the timestamp of the message should be associated with the message. All users in the channel should then see the new message (with display name and timestamp) appear on their channel page. Sending and receiving messages should NOT require reloading the page.
### Remembering the Channel: If a user is on a channel page, closes the web browser window, and goes back to your web application, your application should remember what channel the user was on previously and take the user back to that channel.
### Personal Touch: Add at least one additional feature to your chat application of your choosing! Feel free to be creative, but if you’re looking for ideas, possibilities include: supporting deleting one’s own messages, supporting use attachments (file uploads) as messages, or supporting private messaging between two users.
### In README.md, include a short writeup describing your project, what’s contained in each file, and (optionally) any other additional information the staff should know about your project. Also, include a description of your personal touch and what you chose to add to the project.
### If you’ve added any Python packages that need to be installed in order to run your web application, be sure to add them to requirements.txt!
