# Project Work Document

## Project Title

**Smart Waste Collection Prediction and Route Planning System for Ashta, Madhya Pradesh**

## 1. Introduction

Waste collection is commonly performed on fixed schedules. This can result in overflowing wet-waste bins in busy areas and unnecessary visits to bins that are nearly empty. The proposed system supports waste-collection workers by identifying bins that require attention and preparing an area-wise pickup plan.

The system is designed as a web-based application. It records bin details, fill levels, waste type, collection status, and geographic position. A local prediction module estimates which bins are likely to fill quickly and helps prioritize collection activities.

## 2. Problem Statement

In an area such as Ashta, bins may fill at different rates depending on their location and waste type. A fixed collection schedule does not consider these differences. Wet waste requires quick removal because it may cause bad odour and hygiene issues. Dry and recyclable waste can be collected less frequently when the bin is not near capacity.

The problem is to create a system that predicts bin urgency, schedules the appropriate bins for collection, and gives a worker a clear route for a selected area.

## 3. Project Objectives

1. Create a web dashboard to manage dustbins and monitor fill levels.
2. Allow an administrator to add bin location, waste type, fill percentage, area, and map coordinates through the web page.
3. Prioritize wet-waste bins for same-day collection.
4. Allow dry and recyclable waste to remain for up to three days unless it is near capacity.
5. Identify fast-filling bins using past fill-level observations.
6. Generate an area-wise pickup sequence for waste-collection workers.
7. Display pickup stops on an interactive map of Ashta.

## 4. Current Implementation Status

The project has reached the functional software-prototype stage. The current application works with simulated data and demonstrates the proposed collection logic.

| Component | Status | Description |
| --- | --- | --- |
| Monitoring dashboard | Completed | Displays bin details, fill levels, waste type, urgency, and area. |
| Add dustbin form | Completed | Allows the user to add area, location, type, fill level, latitude, and longitude. |
| Map location selection | Completed | The administrator can click the Ashta map to save a bin location. |
| Pickup Plan page | Completed | Displays priority bins and numbered pickup stops. |
| Wet/dry collection rules | Completed | Applies same-day wet-waste and three-day dry-waste rules. |
| Simulated prediction model | Completed | Uses simulated fill rates to demonstrate fast-filling-bin detection. |
| Mark as collected action | Completed | Resets a collected bin and removes it from the route. |
| Backend APIs and database models | Completed | Models and APIs exist for bins, readings, collections, statistics, and planning. |
| Frontend-backend connection | In progress | The visible dashboard currently uses browser-based demonstration data. |
| Real data collection | Pending | Real bin readings have not yet been entered. |
| Route distance optimization | Pending | Current route is ordered by urgency rather than road distance. |

For the first review, the project may be presented as approximately **40–45% complete**: the functional prototype is ready, while validation with real data and full database integration remain.

## 5. Current System Workflow

```text
Administrator adds bin details through the website
        ↓
Area, location, waste type, fill level, and map point are stored
        ↓
System checks the current level and predicted fill rate
        ↓
Wet, dry, and recyclable waste rules are applied
        ↓
Urgent bins are selected for the relevant area
        ↓
Worker sees numbered stops on the Ashta pickup map
        ↓
Worker marks a bin as collected after pickup
```

## 6. Collection Rules Used

| Waste type | Collection decision |
| --- | --- |
| Wet waste | Schedule same-day pickup when waste is present and the bin has not been collected recently. |
| Dry waste | Schedule pickup when it is at least 80% full, predicted to reach 90% within three days, or has not been emptied for three days. |
| Recyclable waste | Uses the dry-waste planning rule. |
| Critical bin | Highest priority when current or predicted next-day fill level reaches 90%. |

## 7. Prediction Methodology

The backend contains a local linear fill-rate estimator. It analyses recent readings for each bin and estimates how much the fill level rises per day.

Example:

| Observation day | Bin fill level |
| --- | --- |
| Day 1 | 20% |
| Day 2 | 38% |
| Day 3 | 56% |

From these readings, the system estimates a daily increase of approximately 18%. The system can then predict the next-day fill level and decide whether the bin should be added to the worker’s route.

The current web demonstration uses clearly labelled simulated data. Actual readings will replace the simulated values in the next phase.

## 8. Current Demonstration Data

Nine sample bins are placed around Ashta for demonstration. The pickup plan demonstrates three situations:

1. **Urgent wet-waste collection:** B1, B4, and B7 have high fill levels and are scheduled first.
2. **Dry waste at its collection limit:** B2 has crossed the three-day collection period.
3. **Predicted high-fill bins:** B5 and B9 are included because their predicted fill level will approach capacity soon.

Some bins remain off the route to demonstrate that the system avoids unnecessary collection trips.

## 9. Work Remaining

### Immediate software work

1. Connect the frontend dashboard to backend REST APIs.
2. Save newly added bins, readings, and collections permanently in MongoDB.
3. Add forms for editing and deleting bins.
4. Add a daily fill-level reading form for workers or administrators.
5. Connect the Pickup Plan page to the backend planning API.

### Prediction-model work

1. Record real fill levels once or twice per day for selected bins.
2. Collect data for at least one to two weeks.
3. Train and validate the model using historical readings.
4. Compare predicted and actual fill levels.
5. Report average prediction error and identify the fastest-filling locations.

### Map and route work

1. Replace sample coordinates with actual bin coordinates in Ashta.
2. Add the waste vehicle depot or worker starting point.
3. Calculate travel distance and travel time between stops.
4. Improve urgency order into a shortest practical road route.

## 10. Expected Outcomes

The completed project will provide:

- A central dashboard for waste-bin monitoring.
- Better handling of wet waste and high-priority bins.
- Fewer unnecessary collection visits.
- Area-wise pickup lists for workers.
- Historical waste and collection records.
- Data-based evidence of which locations need more frequent collection.

## 11. Weekly Activity Record Template

| Week | Date | Team activity | Hours spent | Output / observation | Supervisor signature |
| --- | --- | --- | --- | --- | --- |
| 1 |  | Problem definition and software architecture |  |  |  |
| 2 |  | Dashboard and bin-management development |  |  |  |
| 3 |  | Map integration and route-planning interface |  |  |  |
| 4 |  | Simulated-data testing and rule validation |  |  |  |
| 5 |  | Real bin data entry and backend integration |  |  |  |
| 6 |  | Model evaluation and report preparation |  |  |  |

## 12. Next Objective

The next objective is to connect the dashboard to the backend database and collect real fill-level readings from selected bins in Ashta. These readings will be used to validate the prediction model and improve the area-wise pickup route.

