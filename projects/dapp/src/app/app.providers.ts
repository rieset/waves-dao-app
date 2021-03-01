import { InjectionToken, Provider, Type } from '@angular/core'
import { environment } from '../environments/environment'

export interface AppConstantsInterface {
  production: boolean
  routes: {[s: string]: string | string[]}
}

export interface UserInterface {
  name: string
  twitter?: string
  facebook?: string
  linkedin?: string
}

export interface AppApiInterface {
  nodes: string
  signer: string
  rest: string
  explorer: string
  confirmations: number
  management: {
    membership: string
  }
  contracts: {
    disruptive: string
    web3: string
    interhack: string
  }
  grantsProgramLink: string
  issues: {
    disruptive: string
    web3: string
    interhack: string
  }
  workingGroup: {[s: string]: {
      name: string
      twitter?: string
      facebook?: string
      linkedin?: string
    }},
  links: {
    telegram?: string
    facebook?: string
    medium?: string
    twitter?: string
    github: {
      api: string
      raw: string
      mdEnd: string
    }
  },
  emails: {
    grants?: string
  }
}

export const APP_CONSTANTS = new InjectionToken<Type<AppConstantsInterface>>('Application constants')

export const API = new InjectionToken<Type<AppApiInterface>>('Application api constants')

export const provideApi = (): Provider[] => [
  {
    provide: API,
    useValue: {
      ...environment.apis,
      confirmations: environment.confirmations,
      grantsProgramLink: environment.grantsProgramLink,
      workingGroup: environment.workingGroup
    }
  }
]

export const provideAppConstants = (): Provider[] => [
  {
    provide: APP_CONSTANTS,
    useValue: {
      routes: environment.routing,
      production: environment.production
    }
  }
]
