import { createClient } from '@vercel/edge-config';

export const config = createClient(process.env.EDGE_CONFIG);