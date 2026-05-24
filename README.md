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
* POST https://assignment-2-program-hero.vercel.app/api/auth/signup
* POST https://assignment-2-program-hero.vercel.app/api/auth/login

## Issues

* POST https://assignment-2-program-hero.vercel.app/api/issues
* GET https://assignment-2-program-hero.vercel.app/api/issues
* GET https://assignment-2-program-hero.vercel.app/api/issues/:id
* PATCH https://assignment-2-program-hero.vercel.app/api/issues/:id
* DELETE https://assignment-2-program-hero.vercel.app/api/issues/:id
