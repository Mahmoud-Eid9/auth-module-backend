# Spin up the server

Clone the repo then run this command in the root folder
```npm intall```

Then to run the project just run this comman
```npm run start```

You can find logs inside `/logs/app.log`



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

- `POST /auth/register`:
  - creates a new user in the database
  - Expected Body:
      ```json
      { "name": "test", "email": "test@test.com", "password": "test" }
      ```
- `POST /auth/login`:
  - verifies the user by comparing `email` and `password hashes` with `DB`
  - Expected Body:
       ```json
      { "email": "test@test.com", "password": "test" }
      ```
- `GET /auth/refresh`:
  - issues new `accessToken` and `refreshToken` and invalidates all previous tokens


## Authorized Routes (requires AccessToken)
- `GET /`:
  - sends a hello message alongside the users name
- `GET /auth/logout`:
  - invalidates the all refreshToken of the user
  - updates the version of the token and deletes the cookie


# Authentication Strategy
## My first intuition
I have always created simple authentications with a simple access token approach,
But this auth module requires good security

pros:
- statless, no hedache of managing tokens in the backend
- simple to implement

So lets state what is wrong with a simple access token approach:
- a stolen token grants complete access forever
- no way of invalidate tokens
- must be stored cautiously due to the security risks tied to it

## Refresh Token appraoch
for this approach we have two token `accessToken` and `refreshToken`
the `refreshToken`'s job is to verify the user in order to generate a new `accessToken`.
So, we generate an `accessToken` with a short life then it expires and the `refreshToken` is only sent when we generate a new `accessToken`

pros:
- a stolen `accessToken` has a short life to be used
- `refreshToken` is only sent when refreshing
- still fairly simple

cons:
- a stolen `refreshToken` has no way to be invalidated which means a stolen one is valid forever
- the `refreshToken` still imposes the same risks as a single token approach when stolen, But with less chances for stealing (sent when refreshing only)

## Statefull Refresh Token
Here each user in the database will have his current active `refreshToken`.
This way other `refreshTokne`s generated for that user in the past can be invalidated by comparing it to `DB`.
In order to make this even more powerfull we generate a new `refreshToken` on `/auth/refresh`.

Pros:
- `refreshToken` can be invalidated
- A stolen `refreshToken` will eventually be invalidated

Cons:
- A user now can only stay logged-in in a single device
  - A log-in from a device will invalidate other tokens used on other devices 
- Statefull, managing token in the back-end

## Rotational Refresh Token (my approach)
A `refreshToken` with rotation is logically the same as saving the token in `DB` but instead of saving the token itself we store the version of the token, this version will be part of the payload of the token.
On `/auth/refresh` the token's version is compared with the version stored in `DB` in order to validate that it is the current valid `refreshToken`

Pros:
- Less data to store in the database

Cons:
- A user can still only stay logged-in in a single device


# what can be improved in my apprach

- Storing several tokens (version, device_id) per user to allow logging-in from different devices
  - `device_id` can be an identifier that is saved in the browser
  - this allows a single user to log-in with multiple devices
- Idle user Risk
  - the risk remaining in our appreach is a stolen refresh token from an idle user
  - we can solve that by validating the token with `device_id`

