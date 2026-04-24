from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Tuple
from backend.graph import find_shortest_path

router = APIRouter(prefix="/route", tags=["Route Optimization"])

class RouteRequest(BaseModel):
    source: str
    destination: str
    hour: int  

class RouteResponse(BaseModel):
    source: str
    destination: str
    best_route: List[str]
    path_coords: List[Tuple[float, float]]
    total_distance: float
    estimated_minutes: int 

@router.post("/best", response_model=RouteResponse)
def get_best_route(data: RouteRequest):
    
    result = find_shortest_path(data.source, data.destination)
    
    if not result:
        raise HTTPException(status_code=404, detail="Route not found")
        
    distance = result["distance"]
    
    # Assume average city speed is 30 km/h (1 km = 2 minutes)
    base_minutes = distance * 2 
    
    # Apply Traffic Penalty based on the Hour
    traffic_multiplier = 1.0
    if 8 <= data.hour <= 10:       # Morning Rush Hour (8 AM - 10 AM)
        traffic_multiplier = 1.8
    elif 17 <= data.hour <= 20:    # Evening Rush Hour (5 PM - 8 PM)
        traffic_multiplier = 2.0
    elif 22 <= data.hour <= 23 or 0 <= data.hour <= 5: # Late Night
        traffic_multiplier = 0.7   
        
    final_minutes = int(base_minutes * traffic_multiplier)

    return {
        "source": data.source,
        "destination": data.destination,
        "best_route": result["path"],
        "path_coords": result["coords"],
        "total_distance": distance,
        "estimated_minutes": final_minutes 
    }