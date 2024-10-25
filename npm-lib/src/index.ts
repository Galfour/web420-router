import express , { Express, Router } from 'express'

interface RouteInfo {
  path : string ,
  methods : string ,
}

interface Layer {
  route?: {
    path : string ,
    methods : { [key : string] : boolean } ,
  } ,
  name? : string ,
  handle? : Router ,
}

const listRoutes = (app: Express) : Array<RouteInfo> => {
  const routes: Array<RouteInfo> = []
  
  const stack = (app._router?.stack || []) as Layer[] ;
  
  for (const middleware of stack) {
    if (middleware.route) {
      // Direct routes
      const methods = Object.keys(middleware.route.methods)
        .filter(method => middleware.route.methods[method])
        .join(', ')
        .toUpperCase()
      
      routes.push({
        path: middleware.route.path,
        methods
      })
    } else if (middleware.name === 'router') {
      // Router middleware
      const routerStack = (middleware.handle?.stack || []) as Layer[]
      
      routerStack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .filter(method => handler.route.methods[method])
            .join(', ')
            .toUpperCase()
          
          routes.push({
            path: handler.route.path ,
            methods ,
          })
        }
      })
    }
  }

  return routes ;
}

// Pretty print function
const prettyPrintRoutes = (app: Express): void => {
  const routes = listRoutes(app)
  console.log('\nRegistered Routes:')
  console.log('=====================================')
  routes.forEach(route => {
    console.log(`${route.methods.padEnd(8)} ${route.path}`)
  })
  console.log('=====================================\n')
}

const app = express() ;

// Define some example routes
app.get('/', (req, res) => res.send('Home'))
app.post('/users', (req, res) => res.send('Create user'))
app.get('/users/:id', (req, res) => res.send('Get user'))

// Print routes using console.table
console.log('Registered Routes:')
console.table(listRoutes(app))

// Or use pretty print
prettyPrintRoutes(app)

export { listRoutes, prettyPrintRoutes }