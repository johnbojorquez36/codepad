<img src="http://codepad.us/images/note-icon.png" align="right" width="15%"/>

# Codepad

## Getting started

The codepad server app (aka codeserver) is written in Clojure, so you will need to install a dependency management tool called Leiningen. This will also be used to compile the app. Start by downloading this [script](https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein) (just right-click and save into your downloads directory).

Once downloaded, copy the script into `~/bin`. Create this directory if it doesn't exist.
```
cp ~/Downloads/lein ~/bin
```

Add this directory to your PATH environment variable by adding the following line to `~/.bashrc`:
```
export PATH=$PATH:~/bin
```

Make the script executable.
```
chmod a+x ~/bin/lein
```

Run `lein` and it will download the self-install package.

## Running the codeserver locally

Codepad's front-end application just consists of a single HTML file and some JavaScript. I know, not very exciting. So, just open `index.html` in your favorite browser. If you want, you could also run a local server to serve the files. Read more [here](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server#Local_files_versus_remote_files).

Once you have Codepad in your browser, you'll need some kind of application (known as the codeserver) on the back-end which can handle the various requests that Codepad makes. For example, each time you type a character, Codepad sends a message to the codeserver to notify all other coders of the character that was typed.

By default, the Codepad page sends messages to the codeserver instance I have running at `codeserver.us`. Because of me being a noob when I wrote this, you'll have to change the string `server_name` in `js/main.js` to `'localhost'`. Make sure to change it back.

To start running the codeserver:
```
cd codeserver/
run lein
```

If this is your first time running it, you'll see a few packages being retrieved and then it will just hang. This is good! It means its working!

## Build instructions for deployment:
If you're not developing features for the codeserver, don't worry about this.

In the `codeserver` directory run:

`lein compile`

`lein uberjar`

which will produce a standalone jar file for the server application.

[logo]: http://codepad.us/images/note-icon.png "Logo Title Text 2"

