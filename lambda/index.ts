
import {createServer, proxy} from 'aws-serverless-express';

import {app} from '../server';

export default (event, context) => proxy(createServer(app), event, context);
