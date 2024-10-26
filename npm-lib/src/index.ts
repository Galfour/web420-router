import express , { Express, Router } from 'express'

type FTWRouteInfo = {
  name : string ,
  description : string ,
  path : string ,
  method : string ,
} ;

type FTWRouter = Array<FTWRouteInfo> ;

type RouteRegister = {
  input : {
    router : FTWRouter ,
  } ,
  output : {
    id : string ,
  } ,
}

type RouteSemanticRoute = {
  input : {
    id : string ,
    raw_url : string ,
  } ,
  output : {
    routed_url : string ,
  } ,
}
