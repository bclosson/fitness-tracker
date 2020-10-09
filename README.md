# FITNESS TRACKER

Interactive blog to track your fitness and goals

## Index:

- [Scope](#Scope)
- [User Stories](#user-stories)
- [Wireframes](#wireframes)
- [Data Models](#data-models)
- [Milestones](#milestones)

## Scope

The final objective is to build an app where users can users track workouts.  Users will be able to visualize thier own workouts and search their workout history. Refer to milestones for full sprints breakdown.

##### Technologies in play

- JavaScript
  - ejs
  - bootstrap
  - router-dom
- NodeJs
  - method-override
  - body parser
  - dotenv
  - express
  - mongoDB
  - mongoose

## User Stories

Fitness tracker user can use this app to track workouts, goals, history, to help them manage thier fitness goals.

#### Non-authenticated Users can:

- View landing page
- Sign Up to Fitness Tracker

#### Authenticated users can

- View landing page
- Input Workouts
- View their profile page
- View their workout history
- View past logged workout information 
- Can edit and delete prior workouts
- Leave reviews for items they have bought (stretch goal)
- Update their profile image

## Wireframes

### Landing

Users will see input to log in or create account

![image](https://jblalock.box.com/s/3jerph8ezznnojulp6pqhku5ayxwke8q)


### Registration

Users who need to create will be guided to registration page

![image](https://jblalock.box.com/s/x59wd1vg3jpm3st1hbxf6tiodhvzu57f)

### Home Page

Build out workout database/log individual workouts, title, data, submit to memory
This will allow user to input workout data to database, as well as have access to edit past workouts.  These workouts will be visible with hyperlinks to view workout details

![image](https://jblalock.box.com/s/ti1cnivsgit6eamdee58wvi3m7paan39)


### Show Workout Page

Details each workout by: (name, date/time, start-time/end-time, type, comments/journal)

View 1
![image](https://jblalock.box.com/s/x59wd1vg3jpm3st1hbxf6tiodhvzu57f)



## Data Models

### Users

- userId
- name
- lastName
- email
- password
- img (stretch)
- workoutID
- timestamp

### Workouts

- workoutId
- name
- date/time
- start-time/end-time
- type
- comments/journal
- timestamp


### Reviews (stretch goal, inter app sharing between users, posting to social)

- userId
- workouts


## Milestones

#### Sprint 1 - 10/9

- approvals
- boilerplate/github setup

#### Sprint 2 - 10/10-10/12

- user sees homepage and is able to create profile
- user is able to input workouts and have them saved, and available for reference
- user can further specify the details of thier workout



#### Sprint 3 - 10/12 - 10/13

- CSS/Bootstrap Styling
- Introduction of 3rd model(stretch goals)
- Test Deployment


#### Sprint 4 / Bonuses - 10/14 - 10/15

- Final Asthetics 
- Presentation Preparation
- Deployment
