# Avatrash-server

## [See the App!](https://avatrash.netlify.app/)

![App Logo](https://i.imgur.com/iRU2Huc.png)

## Description

This project in general is an interactive website between users who can create their own avatars and see the ones that others have created, be able to comment on them and like them.

#### [Client Repo here](https://github.com/AlexMontoro1/Avatrash-client)
#### [Server Repo here](https://github.com/AlexMontoro1/Avatrash-server)

## Backlog Functionalities

-Email verification 
-Live chat
-Random avatar generation
-Avatar war (compete against another person and see who gets the most likes) 
-Implement new accessories and new avatar models

## Technologies used

-HTML
-CSS
-Javascript
-React
-axios
-React Context
-Cloudinary
-Bootstrap
-MongoDB
-MongoAtlas
-Netlify
-GitHub

# Server Structure

## Models

User model

```javascript
{
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    image: {
      type: String 
    },
    role:{
      type:String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {   
    timestamps: true
  }
```

Avatar model

```javascript
{
  seed: String,
  flip: Boolean,
  rotate: {
    type: Number,
    min: 0,
    max: 360,
  },
  scale: {
    type: Number,
    min: 0,
    max: 200,
  },
  radius: {
    type: Number,
    min: 0,
    max: 50,
  },
  size: {
    type: Number,
    min: 1,
  },
  backgroundColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  backgroundType: Array,
  backgroundRotation: Array,
  translateX: {
    type: Number,
    min: -100,
    max: 100,
  },
  translateY: {
    type: Number,
    min: -100,
    max: 100,
  },
  clip: Boolean,
  randomizeIds: Boolean,
  accessories: Array,
  accessoriesColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  accessoriesProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  base: Array,
  clothesColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  clothing: Array,
  clothingGraphic: Array,
  eyebrows: Array,
  eyes: Array,
  facialHair: Array,
  facialHairColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  facialHairProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  hairColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  hatColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  mouth: Array,
  nose: Array,
  skinColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  style: Array,
  top: Array,
  topProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
  },
  name: String,
  json: {
    svg: String
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
},
{   
  timestamps: true
}
```

Comment model
```javascript
{
  content: {
    type: String,
    required: true,
    unique: false,
  },

  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Avatar",
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},
{   
  timestamps: true
}
```

Feedback model
```javascript
{
  contentLike: {
    type: String,
    required: true,
    unique: false,
  },
  contentDislike: {
    type: String,
    required: true,
    unique: false,
  },

},
{  
  timestamps: true
}
```


## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                    |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | -------------------------------------------------------------- |
| POST        | `/auth/signup`              | {name, email, password}      | 201            | 400          | Registers the user in the Database                             |
| POST        | `/auth/login`               | {username, password}         | 200            | 400          | Validates credentials, creates and sends Token                 |
| GET         | `/auth/verify`              |                              | 200            | 401          | Verifies the user Token                                        |
| GET         | `/avatar`                   |                              | 200            | 400          | Show avatars                                                   |
| POST        | `/avatar/create`            | {allParams}                  | 201            | 400          | Creates a new avatar                                           |
| GET         | `/avatar/:avatarId`         |                              | 200            | 400, 401     | Sends all avatar Details                                       |
| PUT         | `/avatar/:avatarId`         | {allParams}                  | 200            | 400, 401     | Edits avatar                                                   |
| DELETE      | `/avatar/:avatarId`         |                              | 200            | 401          | Deletes avatar                                                 |
| GET         | `/profile/main`             |                              | 200            | 401          | Sends user profile details                                     |
| PUT         | `/profile/edit`             |                              | 200            | 400, 401     | Edits the user profile                                         |
| PUT         | `/profile/main`             |                              | 200            | 401          | Upload profile image                                           |
| POST        | `/avatar/:avatarId/comment` |  { content }                 | 200            | 401          | Create a new comment on avatar details page                    |
| DELETE      | `/:avatarId/comment/:commentId`|                           | 200            | 401          | Delete a comment from the owner                                |
| POST        | `/avatar/:avatarId/like`    |  { content }                 | 200            | 401          | Like an avatar                                                 |
| GET         | `/admin/feedback`           |                              | 200            | 400          | Show feedback                                                  |
| POST        | `/admin/feedback`           | {contentLike, contentDislike}| 201            | 400          | Creates a new feedback                                         |

  
## Links

### Collaborators

[Alex Montoro](https://github.com/AlexMontoro1)

### Project

[Repository Link Client](https://github.com/AlexMontoro1/Avatrash-client)

[Repository Link Server](https://github.com/AlexMontoro1/Avatrash-server)

[Deploy Link](https://avatrash.netlify.app/)
