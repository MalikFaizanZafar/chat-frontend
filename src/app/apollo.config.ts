import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLConfigModule {
  constructor(apollo: Apollo, private httpClient: HttpClient) {
    const httpLink = new HttpLink(httpClient).create({
      uri: 'http://localhost:3000/graphql'
    });

    const subscriptionLink = new WebSocketLink({
      uri:
        'ws://localhost:3000/graphql',
      options: {
        reconnect: true,
        timeout: 10000
      }
    });

    const link = split(
      ({ query }) => {
        let definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      subscriptionLink,
      httpLink
    );

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}