const express = require('express');
const router = express.Router(); 

const services = [
  {
    id: 1,
    title: 'Residential Security Guard',
    description: 'Reliable residential night patrols for gated communities.',
    stock: 5
  },
  {
    id: 2,
    title: 'Event Security Management',
    description: 'Professional event crowd control and security.',
    stock: 3
  },
  {
    id: 3,
    title: 'Commercial CCTV Monitoring',
    description: '24/7 monitoring for commercial premises.',
    stock: 0
  },
  {
    id: 4,
    title: 'Personal Bodyguard Services',
    description: 'Discreet VIP protection for public or private outings.',
    stock: 2
  }
];

router.get('/', (req, res) => {
  res.json(services);
});

router.get('/:id', (req, res) => {
  const serviceId = parseInt(req.params.id);
  console.log('GET /api/services/:id hit:', serviceId);

  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.json(service);
});

module.exports = router;
