# Instagram Auto Like Bot

## ⚠️Important

It works only korean environment.

## How it works

1. Open instagram login page.
2. Try login.
3. Redirect to target user's page.
4. Open the latest post.
5. Run the loop.
   - If it was liked, break loop.
   - Else, click like button & next button.

## How to run

### Download a webdriver

- [chrome](https://chromedriver.chromium.org/downloads)

### Set your account

```bash
cp .env.default .env
vi .env
```

### Install packages & Start

```bash
yarn
yarn start ${targetUser}
```
