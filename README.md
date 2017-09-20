
Hikari Chat-bot
=============
This is a chat-bot,
that can made a recommendation to the user.
The type of the content depend on the content
in the database.
This chat-bot Normally deal with any type of a content.

The default data,
we prepare a travel recommendation content.

## Installation
**1 Clone this repository**
```sh
#clone repository
$git clone https://github.com/Kiririn00/chatbot.git
#check branch. should use a master branch
$git branch -v
* master    f8ca166 update least sql file
  original1 d13ecb4 no message
  original2 15449ed will make new branch
```

**2 With [node](http://nodejs.org) [installed](http://nodejs.org/en/download):**
```sh
# Get the stable version of Sails for Hikari Chat-bot
$ npm install sails @0.12.4 -g
```

**3 Install local node module**
```sh
$sudo npm install /<cloned directory> 
```

**4 Download and Install [Xampp](https://www.apachefriends.org), or use bash**
```sh
#Download and install XAMPP
$sudo wget https://downloads.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.30/xampp-linux-x64-5.6.30-1-installer.run
$sudo chmod /<downloaded directory>/+x xampp-osx-5.5.38-1-installer.dmg
$sudo ./xampp-osx-5.5.38-1-installer.dmg
```

##Get started

**1 open [Xampp](https://www.apachefriends.org) 
with control panel and
activate Apache, MySQL and ProFTPD,
or you can activate by bash**

```sh
#if you use OSX
$sudo /Application/XAMPP/xamppfiles/xampp start
```

**2 Go to cloned repository and run sails**
```sh
#run sails
$sails lift
```

**3 Access to localhost with browser**

**localhost:1337/Chat/Chatbox**

## License
**MIT License**
