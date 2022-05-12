# Frontend for the Witnet Explorer
This repository contains all code to create the frontend for the Witnet Explorer. The explorer is currently hosted at [witnet.network](https://witnet.network).

## Dependencies

You'll have to install Node.js. Currently the frontend has been tested with the newest version of Node.js, v18.x.
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```
Install the nodejs package with your favorite package manager (e.g., apt):
```
sudo apt-get install -y nodejs
```

## Setup

First install all dependencies using npm and afterwards, the website can be built.
```
npm install
npm run build; rm -r release; mv build release
```
