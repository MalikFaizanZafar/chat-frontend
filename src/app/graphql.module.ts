import {NgModule} from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';


const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
let  httpClient: HttpClient;
const httpLink = new HttpLink(httpClient).create({
  uri: 'http://localhost:3000/graphql'
});

const subscriptionLink = new WebSocketLink({
  uri:
    'ws://localhost:3000/graphql',
  options: {
    reconnect: true
  }
});
const link = split(
  null,
  subscriptionLink,
  httpLink
);
export function createApollo(httpLink: HttpLink) {
  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
