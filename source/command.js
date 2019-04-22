#! /usr/bin/env node

import '@babel/polyfill';

import { stringify } from 'yaml';

import updateEvents, { descendDate } from './index';

updateEvents().then(list => console.info(stringify(list.sort(descendDate))));
