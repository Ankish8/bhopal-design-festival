import type { NextApiRequest, NextApiResponse } from 'next';
import { get } from '@vercel/edge-config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { counts } = req.body;
    
    // Update the Edge Config
    const config = { matcher: '/welcome' };
    await get('workshopCounts', counts);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating workshop slots:', error);
    return res.status(500).json({ message: 'Failed to update workshop slots' });
  }
}