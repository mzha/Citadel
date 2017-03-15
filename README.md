# Citadel

Identity and Access Management. Resource Access Tracking.
This is the Front-End.

## Installation
Assuming you have node.js and npm installed:
Download the files or clone into a new repository. Then run

```
npm install
```

It will download all the dependencies. Then run

```
npm run watch
```

to start the program and navigate to `localhost:3000` to see it in action.

## Testing

There are currently only two users to test with.

| Username | Password | Name        | Administrator? |
|----------|----------|-------------|----------------|
| mike     | michael  | Michael Qu  | No             |
| bob      | bob      | Bobby Landy | Yes            |

You only need the username and password to log in. There are different home screens for admins and non-admins so try both out. You can add contracts or add requests in each home screen respectively. They are stored in a mongo database. Ask me (Michael) if you want access to the database.

## CSS Work Needed
Literally everything needs css. You can find the classes in the .pug files under views, and the current barebones css under public/stylesheets/style.css. Feel free to add your own classes and ids to things to style them more.
