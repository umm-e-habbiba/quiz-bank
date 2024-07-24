# ZAP70 Quiz Bank

![zap70](https://github.com/user-attachments/assets/2ce8b75b-7968-4133-8f6c-3a6d53c9a937)

The ZAP-70 Question Bank was produced by AJ, creator of AJmonics. AJ is a medical student whose life mission is to elevate the world with kindness, goodness, and insane creativity. He believes that medical students should not be paying a fraction of the portion that they pay - for the (often) inefficient and boring education that they get. This is why, after producing AJmonics.com, a platform of Pixar-style animated video to enhance education and fun, he created ZAP-70, a free question bank for students to learn (and often have a good time too!).


## Table of Contents

- [Installation](#installation)

- [Basic usage](#basic-usage)
- [What's included](#whats-included)

### Installation

```bash
$ npm install
```

or

```bash
$ yarn install
```

### Basic usage

```bash
# dev server with hot reload at http://localhost:3000
$ npm start
```

or

```bash
# dev server with hot reload at http://localhost:3000
$ yarn start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

or

```bash
# build for production with minification
$ yarn build
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
coreui-free-react-admin-template
├── public/          # static files
│   ├── favicon.ico
│   ├── logo zap-01.png
│   ├── index.html
│   └── manifest.json
│
├── src/             # project root
│   ├── assets/      # images, icons, etc.
│   ├── components/  # common components - header, footer, sidebar, etc.
│   ├── layouts/     # layout containers
│   ├── scss/        # scss styles
│   ├── views/       # application views
│   ├── Step2ScoreConversion.js      # step two scoring system
│   ├── _admin_nav.js      # admin sidebar navigation config
│   ├── _nav.js      # sidebar top navigation config
│   ├── _nav_bottom.js      # sidebar bottom navigation config
│   ├── App.js
│   ├── index.js
│   ├── UsmleData.js    # Usmle categories
│   ├── routes.js    # routes config
│   └── store.js     # template state example
│
├── index.html       # html template
├── ...
├── package.json
├── ...
└── vite.config.mjs  # vite config
```
