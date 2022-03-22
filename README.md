# EECS 570 Final Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setting up a virtual environment

```
pip install virtualenv  # If you don't have this already
virtualenv venv
source venv/bin/activate
```

To have a virtual environment for your npm packages, run:
```
pip install nodeenv
nodeenv -p
```

To install the required npm packages:
```
npm ci
```

## Starting the app

```
source venv/bin/activate
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.