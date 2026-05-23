# Features
* JWT authentication
* Role-based access (Contributor, Maintainer)
* Create, read, update, delete issues
* Ownership-based update rules
* Input validation
* Secure password hashing
* PostgreSQL relational structure

# Setup
```
git clone git@github.com:tanvir0188/Assignment-2.git
cd issue-tracker
npm install
npm run dev
```

# API  endpoints

## Auth
* POST /api/auth/signup
* POST /api/auth/login

## Issues

* POST /api/issues
* GET /api/issues
* GET /api/issues/:id
* PATCH /api/issues/:id
* DELETE /api/issues/:id
