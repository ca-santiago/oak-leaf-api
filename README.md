# oak-leaf-api
Main API service for oak leaf 


# Run the project

__Node version__
Set the correct node version defined on .nvmrc
```sh
$ nvm use 
```
__Install__
```sh
$ npm ci
```
__Env vars__

Provide the secrets and db connection strings needed for database and auth provider

### Dev
```sh
$ npm run dev
```

### Prod
```
$ npm run build && npm start
```

## Dev tools


### Prisma

This service uses [prisma](https://www.prisma.io/) for db connection. So you have access to the prisma studio by running `npx prisma studio`
