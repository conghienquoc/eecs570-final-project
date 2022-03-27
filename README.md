# EECS 570 Final Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Frontend

## Setting up a virtual environment

```
pip install virtualenv  # If you don't have this already
virtualenv venv
source venv/bin/activate
```

- Create a virtual environment for your npm packages, run
```
pip install nodeenv
nodeenv -p
```

- Install the required npm packages
```
npm ci
```

- Create an `.env` file in the main project directory (i.e., eecs570-final). You can copy and paste the content inside the `.env.example` file. This is where the routes for the backend APIs are configured. 

## Starting the app

```
source venv/bin/activate
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Making HTTP requests

If you want to make requests to localhost, you need to set up and deploy the backend on a separate terminal as well. Currently, the frontend code is configured to make requests to a local backend. Read the *Backend* section below if you want to switch to using Angel's deployed backend code on Pythonanywhere.

# Backend

## Configure backend route

There are currently two backend routes (see `.env.example`):
- `REACT_APP_BACKEND_ANGEL_URL`: This is where Angel is currently hosting his backend API on Pythonanywhere.
- `REACT_APP_BACKEND_BASE_URL`: This is where the backend is deployed locally if we run the backend code locally.

**<u>Note:</u>** To change where the HTTP requests from the frontend is getting sent to, change the `baseURL` variable inside `/utils/http-common.js`. There should already be a commented out line and you can switch between the two `baseURL`s.

## Setting up and running the backend locally

You can find Angel's backend code [here](https://github.com/skinnyasianguy/eecs_570).

- Create a virtual environment

```
virtualenv venv
source venv/bin/activate
```

- Install the required packages

```
pip install -r requirements.txt
pip install flask_cors  # can Angel update to include this inside requirements.txt?
```

- Start the backend

```
python main.py
```