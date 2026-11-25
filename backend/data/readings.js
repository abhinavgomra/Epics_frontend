//For now, this file will hold a few fake sensor readings. Later, MongoDB will replace this, and eventually the ESP32/ultrasonic sensor will send the real readings.

const readings = [
  {
    id: "R1",
    binId: "B1",
    fillLevel: 45,
    timestamp: "2026-08-21T09:00:00"
  },
  {
    id: "R2",
    binId: "B1",
    fillLevel: 62,
    timestamp: "2026-08-21T12:00:00"
  },
  {
    id: "R3",
    binId: "B1",
    fillLevel: 81,
    timestamp: "2026-08-21T15:00:00"
  },
  {
    id: "R4",
    binId: "B1",
    fillLevel: 92,
    timestamp: "2026-08-21T18:00:00"
  },
  {
    id: "R5",
    binId: "B7",
    fillLevel: 40,
    timestamp: "2026-08-21T09:00:00"
  },
  {
    id: "R6",
    binId: "B7",
    fillLevel: 58,
    timestamp: "2026-08-21T12:00:00"
  },
  {
    id: "R7",
    binId: "B7",
    fillLevel: 76,
    timestamp: "2026-08-21T15:00:00"
  },
  {
    id: "R8",
    binId: "B7",
    fillLevel: 95,
    timestamp: "2026-08-21T18:00:00"
  }
];

module.exports = readings;
