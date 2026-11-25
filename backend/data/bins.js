
// Demo data. Dates are generated relative to today so the pickup plan stays usable.
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const bins = [
  {
    id: "B1",
    block: "Block A",
    location: "Canteen",
    fillLevel: 92,
    type: "wet",
    lastEmptied: daysAgo(1.2)
  },
  {
    id: "B2",
    block: "Block A",
    location: "Canteen",
    fillLevel: 67,
    type: "dry",
    lastEmptied: daysAgo(3.2)
  },
  {
    id: "B3",
    block: "Block A",
    location: "Library Corridor",
    fillLevel: 34,
    type: "recyclable",
    lastEmptied: daysAgo(0.5)
  },
  {
    id: "B4",
    block: "Block B",
    location: "Lab Wing",
    fillLevel: 88,
    type: "wet",
    lastEmptied: daysAgo(1.1)
  },
  {
    id: "B5",
    block: "Block B",
    location: "Parking Area",
    fillLevel: 55,
    type: "dry",
    lastEmptied: daysAgo(2)
  },
  {
    id: "B6",
    block: "Block B",
    location: "Sports Complex",
    fillLevel: 22,
    type: "recyclable",
    lastEmptied: daysAgo(0.7)
  },
  {
    id: "B7",
    block: "Block C",
    location: "Admin Building",
    fillLevel: 95,
    type: "wet",
    lastEmptied: daysAgo(1.3)
  },
  {
    id: "B8",
    block: "Block C",
    location: "Hostel Block",
    fillLevel: 48,
    type: "dry",
    lastEmptied: daysAgo(1.2)
  },
  {
    id: "B9",
    block: "Block C",
    location: "Auditorium",
    fillLevel: 73,
    type: "recyclable",
    lastEmptied: daysAgo(2.5)
  }
];

module.exports = bins;
