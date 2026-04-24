import networkx as nx
import math

# 1. BUILD THE MEGA HYDERABAD MAP
def build_hyderabad_graph():
    G = nx.Graph()
    
    # 50 Locations with approximate GPS Coordinates [Lat, Lon]
    locations = {
        "Abids": (17.3891, 78.4770), "Alwal": (17.5046, 78.5044), "Amberpet": (17.3972, 78.5146), 
        "Ameerpet": (17.4357, 78.4444), "Attapur": (17.3698, 78.4312), "Bachupally": (17.5269, 78.3719), 
        "Banjara Hills": (17.4156, 78.4394), "Begumpet": (17.4447, 78.4664), "Bolarum": (17.5186, 78.5085), 
        "Bowenpally": (17.4704, 78.4842), "Chanda Nagar": (17.4952, 78.3315), "Charminar": (17.3616, 78.4747), 
        "Dilsukhnagar": (17.3688, 78.5247), "Gachibowli": (17.4401, 78.3489), "Gandimaissama": (17.5684, 78.4116),
        "Ghatkesar": (17.4503, 78.6830), "Habsiguda": (17.4093, 78.5414), "Hafeezpet": (17.4839, 78.3480), 
        "Hayathnagar": (17.3204, 78.6017), "Hitech City": (17.4435, 78.3772), "JNTU": (17.4938, 78.3976), 
        "Jubilee Hills": (17.4311, 78.4074), "Khairatabad": (17.4110, 78.4593), "Kompally": (17.5385, 78.4842), 
        "Kondapur": (17.4622, 78.3568), "Koti": (17.3855, 78.4867), "Kukatpally": (17.4875, 78.4010), 
        "LB Nagar": (17.3457, 78.5522), "Lakdikapul": (17.4035, 78.4651), "Lingampally": (17.4836, 78.3158), 
        "Madhapur": (17.4483, 78.3915), "Malkajgiri": (17.4526, 78.5332), "Masab Tank": (17.3973, 78.4486), 
        "Medchal": (17.6293, 78.4815), "Mehdipatnam": (17.3934, 78.4323), "Miyapur": (17.4968, 78.3615), 
        "Nacharam": (17.4262, 78.5630), "Nampally": (17.3879, 78.4682), "Nizampet": (17.5140, 78.3852), 
        "Panjagutta": (17.4259, 78.4520), "Paradise": (17.4421, 78.4879), "Pragathi Nagar": (17.5113, 78.3979), 
        "Raidurg": (17.4239, 78.3840), "Ramanthapur": (17.3916, 78.5233), "Sainikpuri": (17.4912, 78.5385), 
        "Secunderabad Station": (17.4330, 78.5046), "Shamirpet": (17.6042, 78.5667), "Tarnaka": (17.4293, 78.5369), 
        "Tolichowki": (17.3980, 78.4144), "Uppal X Roads": (17.3990, 78.5583), "Yapral": (17.5028, 78.5298)
    }
    
    # Add Nodes to Graph
    for loc, coords in locations.items():
        G.add_node(loc, pos=coords)
        
    # AI ALGORITHM TO AUTO-DRAW ROADS
    nodes = list(locations.keys())
    for node1 in nodes:
        distances = []
        for node2 in nodes:
            if node1 != node2:
                # Calculate straight-line mathematical distance
                lat1, lon1 = locations[node1]
                lat2, lon2 = locations[node2]
                dist = math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)
                distances.append((dist, node2))
        
        # Sort to find the closest places
        distances.sort()
        
        # Connect this node to its 3 closest neighbors
        for i in range(3):
            closest_node = distances[i][1]
            raw_dist = distances[i][0]
            # Convert map coordinates difference to rough Kilometers (1 degree ~ 111 km)
            km_dist = round(raw_dist * 111, 1)
            G.add_edge(node1, closest_node, weight=km_dist)
            
    return G, locations

# 2. FIND SHORTEST PATH ALGORITHM (Dijkstra)
def find_shortest_path(source, destination):
    G, locations = build_hyderabad_graph()
    
    try:
        if source not in locations or destination not in locations:
            return None
            
        path = nx.shortest_path(G, source=source, target=destination, weight="weight")
        total_dist = nx.shortest_path_length(G, source=source, target=destination, weight="weight")
        path_coords = [locations[node] for node in path]
        
        return {
            "path": path,             
            "coords": path_coords,    
            "distance": total_dist    
        }
    except Exception as e:
        print(f"Graph Error: {e}")
        return None