# Setup

Clone the repo then run this command in the root folder
```npm intall``

Then to run the project just run this comman
```npm run start```

You can find logs inside `/logs/app.log`

## .env Inlcuded
Normally it shouldn't, but in order for you to spin up the project right away I included it


# Project Structure
nest depends on modules, so following what nest encourages us to do.
The project consists of the following modules
- app: the root module where the app is bootstraped
- auth: the auth module contains the routes and logic behind authentication
- user: doesn't have routes unfortunately but the user service has everything to do with creating and manuplating users

## for each module you will find:
- module: the configs of the module
- controller: where routes are configured, it is a facade design pattern because it is really simple functions that really recieves request and hand them to the service
- serivce: service is where actual logic is coded


# Routes

- `POST /auth/register`: a post request that expects (name, email, password) in the body
- `POST /auth/login`: a post request that expects (email, passowrd) in the body
- `GET /auth/refresh`:a get request that creates a new accessToken and refreshToken and invalidates the previous refreshToken
- `GET /auth/logout`: a get request that invalidates the current refreshToken of the user by updating the version of the token rotation and deleting the cookie

## Authorized Routes (AccessToken)
- `GET /`: a get request that sends a hello message alongside the users name


# Authentication Strategy
## My first intuition
I have always created simple authentications with a simple access token approach,
But this auth module requires good security

pros:
- statless, no hedache of managing tokens in the backend
- simple to implement

So lets state what is wrong with a simple access token approach:
- a stolen token can be used indefenitely
- no way of invalidating tokens
- token must be stored properly (no LocalStorage)

## Refresh Token appraoch
for this approach we have two token `accessToken` and `refreshToken`
the `refreshToken`'s job is to verify the user in order to generate a new `accessToken`.
So, we generate an `accessToken` with a short life then it expires and the `accessToken` is only sent when we generate a new `accessToken`

pros:
- a stolen `accessToken` has a short life to be used
- still fairly simple

cons:
- a stolen `refreshToken` has no way to be invalidated which means a stolen one is valid forever
- the `refreshToken` still imposes the same risks as a single token approach when stolen

## Statefull updatable Refresh Token
Here each user in the database will have his current active `refreshToken`.
This way other `refreshTokne`s generated for that user in the past can be invalidated by comparing it to `DB`.
In order to make this even more powerfull we generate a new `refreshToken` on `/auth/refresh`.

Pros:
- a stolen `refreshToken` can be invalidated by user action (logout, refresh, log-in)

Cons:
- a user now can only log-in with a single device
- Statefull, managing token in the back-end

## Rotational Refresh Token (my approach)
a `refreshToken` with rotation is logically the same as saving the token in `DB` but instead of saving the token itself we store the version of the token, this version will be part of the payload of the token.
on `/auth/refresh` the token's version is compared with the version stored in `DB` in order to validate that it is the current valid `refreshToken`

Pros:
- less data to store in the database


# what can be improved in my apprach

- storing several tokens (version, device_id) per user to allow logging-in from different devices
  - `device_id` can be an identifier that is saved in the browser
  - this allows a single user to log-in with multiple devices
- Idle user Risk
  - the risk remaining in our appreach is a stolen refresh token from an idle user
  - reuse detection: we store the latest issued token, when a mismatch happens we invalidate all refresh tokens and force a new log-in
- CSRF tokens
  - protecting froms
