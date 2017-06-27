# Tweet in Translation 🐦

Tweet In Translation, or [@linguarit](https://twitter.com/linguarit) on Twitter, is a Twitter bot that tweets random French and German translations of useful day to day sentences.
The translations are converted into an image file so it becomes easier to read, and not limited by Twitter's character limit.

The motivation for this project was to generate dynamic images on the fly using node.js based off a JSON file... and a translation project was randomly born 🤔

## Install it locally

You'll need your own Twitter app key, and write down all the secrets on an `.env` file in the project root. 
For example:

```
CONSUMER_KEY=xxww
CONSUMER_SECRET=xxqqaa
ACCESS_TOKEN=44xxqq
ACCESS_TOKEN_SECRET=99xxyyz
```

Then install the dependencies and run it locally by doing:

`npm install && npm run dev`

### Sources for the translations

Some sentences were randomly translated by myself, while others taken from the following websites:

- [Fluentu](http://www.fluentu.com/german/blog/common-useful-german-travel-phrases-vocabulary-words/)
- [TalkInFrench](https://www.talkinfrench.com/50-common-french-phrases/)
